import { action } from '@storybook/addon-actions';
import { CSFStory } from 'creevey';
import React, { useRef, useState } from 'react';

import { Button } from '../../Button';
import { Checkbox } from '../../Checkbox'; // 1
import { Input } from '../../Input'; // 1
import { Link } from '../../Link'; // 2
import { Toast } from '../../Toast';
import { Toggle } from '../../Toggle'; // 1

export default { title: 'TR 3' };

export const CheckBoxStates: CSFStory<JSX.Element> = () => {
  const [checked, setChecked] = useState<boolean>(false);
  const checkbox = useRef<Checkbox>(null);

  const handleChangeIndeterminate = () => {
    const currentCheckBox = checkbox?.current;
    if (currentCheckBox?.state.indeterminate) {
      currentCheckBox?.resetIndeterminate();
    } else {
      currentCheckBox?.setIndeterminate();
    }
  };

  return (
    <section>
      <Checkbox ref={checkbox} checked={checked} onClick={() => setChecked(!checked)} />
      <br />
      <br />
      <Button onClick={handleChangeIndeterminate}>Изменить initialIndeterminate</Button>
    </section>
  );
};

/**
 *  CheckBox.
 *
 *  0. История CheckBoxDefault
 *  1. Найти элемент на странице
 *  2. hover
 *  3. 📸 состояние hovered
 *  4. click
 *  5. 📸 состояние clicked
 *  7. indeterminate
 *  8. 📸 состояние indeterminate
 *  9. reset indeterminate
 *  10. 📸 состояние reset indeterminate
 *
 */

CheckBoxStates.story = {
  parameters: {
    creevey: {
      tests: {
        async states() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const checkbox = await this.browser.findElement({ css: '[data-comp-name~=Checkbox]' });
          const button = await this.browser.findElement({ css: 'button' });

          const idle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: checkbox })
            .perform();
          const hover = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(checkbox)
            .perform();
          const checked = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(checkbox)
            .perform();
          const unChecked = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(button)
            .perform();
          const setInitialIndeterminate = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(button)
            .perform();
          const resetInitialIndeterminate = await element.takeScreenshot();

          await this.expect({
            idle,
            hover,
            checked,
            unChecked,
            setInitialIndeterminate,
            resetInitialIndeterminate,
          }).to.matchImages();
        },
      },
    },
  },
};

export const InputStates: CSFStory<JSX.Element> = () => {
  const [value, setValue] = useState<string>('');
  const isError = value === 'error';
  const disabled = value === 'disabled';
  const warning = value === 'warning';

  return (
    <section>
      <Input
        value={value}
        error={isError}
        disabled={disabled}
        warning={warning}
        onChange={event => setValue(event.currentTarget.value)}
      />
    </section>
  );
};

/**
 *  Input.
 *
 *  0. История InputDefault
 *  1. Найти элемент на странице
 *  2. focus
 *  3. 📸 состояние focus
 *  4. ввести текст err
 *  5. 📸 состояние с текстом
 *  7. ввести текст error
 *  8. 📸 состояние error
 *  9. ввести текст disable
 *  10. 📸 состояние disable
 *
 */

InputStates.story = {
  parameters: {
    creevey: {
      tests: {
        async states() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const input = await this.browser.findElement({ css: '[data-comp-name~=Input]' });

          const idle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(input)
            .perform();

          const focused = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .sendKeys('err')
            .perform();

          const typed = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .sendKeys('or')
            .perform();

          const withError = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .doubleClick(input)
            .sendKeys('warning')
            .perform();

          const withWarning = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .doubleClick(input)
            .sendKeys('disabled')
            .perform();

          const disabled = await element.takeScreenshot();

          await this.expect({ idle, focused, typed, withError, withWarning, disabled }).to.matchImages();
        },
      },
    },
  },
};

export const UncontrolledToggle: CSFStory<JSX.Element> = () => <Toggle onValueChange={action('toggle')} />;

/**
 *  UncontrolledToggle.
 *
 *  1. Найти элемент на странице
 *  2. hover
 *  3. 📸 состояние hovered
 *  4. click
 *  5. 📸 состояние checked
 *  7. un-hovered
 *  8. 📸 состояние un-hovered
 *  9. click
 *  10. 📸 состояние un-checked
 *
 */

UncontrolledToggle.story = {
  parameters: {
    creevey: {
      tests: {
        async hover() {
          // 1. находим элемент для скриншота
          const element = await this.browser.findElement({ css: '#test-element' });
          const root = await this.browser.findElement({ css: '#root'});
          // находим кнопку
          const toggle = await this.browser.findElement({ css: '[data-comp-name*=Toggle]' });
          const toggle_checkbox = await this.browser.findElement({ css: '[data-prop-type*=checkbox]' });

          // 2. делаем скриншот "по умолчанию"
          const idle = await element.takeScreenshot();

          // 3. наводим указатель мыши
          await this.browser
            .actions({ bridge: true })
            .move({ origin: toggle })
            .perform();

          // 4. делаем скриншот "при наведении"
          const hover = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(toggle_checkbox)
            .perform();

          // делаем скриншот "при чеке"
          const check_on = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: root })
            .perform();

          // делаем скриншот "без ховера"
          const hover_off = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(toggle_checkbox)
            .perform();

          // делаем скриншот "при анчеке"
          const check_off = await element.takeScreenshot();

          // 5. сравниваем результаты
          await this.expect({ idle, hover, check_on, hover_off, check_off }).to.matchImages();
        },
      },
    },
  },
};

export const Simple_link: CSFStory<JSX.Element> = () => <Link>Very Simple Link</Link>;
Simple_link.story = {
  parameters: {
    creevey: {
      tests: {
        async hover() {
          // 1. находим элемент для скриншота
          const element = await this.browser.findElement({ css: '#test-element' });

          // находим link
          const link = await this.browser.findElement({ css: '[data-comp-name*=Link]' });

          // 2. делаем скриншот "по умолчанию"
          const idle = await element.takeScreenshot();

          // 3. наводим указатель мыши
          await this.browser
            .actions({ bridge: true })
            .move({ origin: link })
            .perform();

          // 4. делаем скриншот "при наведении"
          const hover = await element.takeScreenshot();

          // 5. сравниваем результаты
          await this.expect({ idle, hover }).to.matchImages();
        },
      },
    },
  },
};

export const Link_WithOnClick: CSFStory<JSX.Element> = () => <Link onClick={() => Toast.push('RUN!')}>Another Simple Link</Link>;
Link_WithOnClick.story = {
  parameters: {
    creevey: {
      tests: {
        async hover() {
          // 1. находим элемент для скриншота
          const element = await this.browser.findElement({ css: '#test-element' });

          // находим link
          const link = await this.browser.findElement({ css: '[data-comp-name*=Link]' });

          // 2. делаем скриншот "по умолчанию"
          const idle = await element.takeScreenshot();

          // 3. наводим указатель мыши
          await this.browser
            .actions({ bridge: true })
            .move({ origin: link })
            .perform();

          // 4. делаем скриншот "при наведении"
          const hover = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(link)
            .perform();

          // Находим тост
          const toast_element = await this.browser.findElement({ css: '[data-tid*=ToastView__root]'});

          // 5. делаем скриншот "при клике"
          const toast = await toast_element.takeScreenshot();

          // 6. сравниваем результаты
          await this.expect({ idle, hover, toast }).to.matchImages();
        },
      },
    },
  },
};
