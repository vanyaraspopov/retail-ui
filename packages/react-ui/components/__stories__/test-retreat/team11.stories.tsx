import { action } from '@storybook/addon-actions';
import { CSFStory } from 'creevey';
import React from 'react';

import { Nullable } from '../../../typings/utility-types';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { Toast } from '../../Toast'; // 2
import { Tooltip } from '../../Tooltip'; // 1

export default {
  title: 'TR 11',
};

// Фичареквест:
// В компоненте текст не может быть набран в две строки (по гайдам).
// Тем не менее, он переносится в случае, если в длинной строке есть пробелы
// Мы предлагаем обдумать это место в гайдах и в случае, когда текст не помещается в одну строку,
// обрезать его с троеточием в конце

export const LongName: CSFStory<JSX.Element> = () => (
  <Toast>
    longggggggggggggname1234512345123451234512345123451234512345123451234512345123451234512345jgjjjjjgfgfffffffffjgjfgjfgjjfjgjfgverylonggkgkkgkgkvfgkgkkgkgkg
  </Toast>
);
LongName.story = { name: 'toast with long name' };

export const ToastDissapearWhenNext: CSFStory<JSX.Element> = () => {
  let toast1: Nullable<Toast>;
  let toast2: Nullable<Toast>;

  return (
    <div style={{ padding: '4px 200px 200px 4px' }}>
      <Toast ref={el => (toast1 = el)} onClose={action('close')} onPush={action('push')} />
      <Toast ref={el => (toast2 = el)} onClose={action('close')} onPush={action('push')} />
      <div style={{ padding: '4px 200px 200px 4px' }} />
      <Button data-tid="firstButton" onClick={showToast1}>
        Show 1st toast
      </Button>
      <Button data-tid="secondButton" onClick={showToast2}>
        Show 2nd toast
      </Button>
    </div>
  );

  function showToast1() {
    if (toast1) {
      toast1.push('Toast with long name long long');
    }
  }

  function showToast2() {
    if (toast2) {
      toast2.push('Toast');
    }
  }
};

// BUG: Не выполняется требование гайдов:
// Всегда показывается только 1 тост. Перед появлением следующего тоста, текущий скрывается, даже если время его показа еще не истекло.

// 0. Кнопка 1 вызывает длинный тост. Кнопка 2 вызывает короткий тост
// 1. Найти кнопку 1. Нажать ее, запустить таймер на 1 секунду
// 2. По истечению таймера сфотографировать 1 тост
// 3. Найти кнопку 2. Нажать ее, запустить таймер на 1 сек
// 4. По истечению таймера сфотографировать 2 тост (1 пропал)

ToastDissapearWhenNext.story = {
  parameters: {
    creevey: {
      tests: {
        async itemSelected() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const button1 = await this.browser.findElement({ css: '[data-tid~=firstButton]' });
          const button2 = await this.browser.findElement({ css: '[data-tid~=secondButton]' });

          await this.browser
            .actions({ bridge: true })
            .click(button1)
            .perform();

          const toast1 = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(button2)
            .perform();

          const toast2 = await element.takeScreenshot();

          await this.expect({ toast1, toast2 }).to.matchImages();
        },
      },
    },
  },
};

// 0. Имеется поле ввода и тултип с кнопкой, по клику на которую поле ввода фокусится
// 1. Триггерим тултип по клику, сфотографируем
// 2. Кликаем по кнопке в тултипе
// 3. Тултип должен закрыться, сфотографируем

export const ToolptipWithLinkInside: CSFStory<JSX.Element> = () => {
  let input: Nullable<Input>;

  const renderTooltip = () => {
    return (
      <div>
        Text and{' '}
        <Button onClick={handleButtonClick} data-tid={`buttonToClick`} use="link">
          Button
        </Button>
      </div>
    );
  };

  const handleButtonClick = () => {
    if (input) {
      input.focus();
    }
  };

  return (
    <div>
      <Tooltip trigger="click" render={renderTooltip}>
        <Input data-tid={`inputWithTooltip`} />
      </Tooltip>
      <div>
        <Input ref={el => (input = el)} data-tid={`inputToFocus`} />
      </div>
    </div>
  );
};

ToolptipWithLinkInside.story = {
  parameters: {
    creevey: {
      tests: {
        async itemSelected() {
          const element = await this.browser.findElement({ css: `#test-element` });
          const inputField1 = await this.browser.findElement({ css: `[data-tid~=inputWithTooltip]` });

          await this.browser
            .actions({ bridge: true })
            .click(inputField1)
            .perform();

          const tooltip = await element.takeScreenshot();

          const button = await this.browser.findElement({ css: `[data-tid~=buttonToClick]` });

          await this.browser
            .actions({ bridge: true })
            .click(button)
            .sendKeys(`this is very long text to enter into inputField`)
            .perform();

          const focusedInputWithText = await element.takeScreenshot();

          await this.expect({ tooltip, focusedInputWithText }).to.matchImages();
        },
      },
    },
  },
};
