import { CSFStory } from 'creevey';
import React from 'react';

export default {
  title: 'TR 7',
};

import { delay } from '../../../../lib/utils';
import { Gapped } from '../../../Gapped';
import { Radio } from '../../../Radio';
import { RadioGroup } from '../../../RadioGroup'; // 5

import { TestWithSingleAnswer, Option } from './TestWithSingleAnswer';

export const MathTest: CSFStory<JSX.Element> = () => {
  const options: Option[] = [
    { id: '1', value: '2' },
    { id: '2', value: '4' },
    { id: '3', value: '5' },
  ];

  return <TestWithSingleAnswer rightOptionId="2" options={options} title="сколько будет 2 * 2?" />;
};

MathTest.story = {
  parameters: {
    creevey: {
      tests: {
        async checkCorrectAnswer() {
          const testContainer = await this.browser.findElement({ css: '#test-element' });
          const rightAnswer = await this.browser.findElement({ css: '[data-tid~=option1]' });
          const checkButton = await this.browser.findElement({ css: '[data-tid~=checkButton]' });
          const dafaultState = await testContainer.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: rightAnswer })
            .click()
            .perform();

          const stateAfterCorrectAnswerClick = await testContainer.takeScreenshot();
          await this.browser
            .actions({ bridge: true })
            .move({ origin: checkButton })
            .click()
            .perform();

          const stateAfterCheck = await testContainer.takeScreenshot();

          await this.expect({ dafaultState, stateAfterCorrectAnswerClick, stateAfterCheck }).to.matchImages();
        },

        async checkLoosingFocusOnSelectedRadio() {
          const testContainer = await this.browser.findElement({ css: '#test-element' });
          const rightAnswer = await this.browser.findElement({ css: '[data-tid~=option1]' });

          await this.browser
            .actions({ bridge: true })
            .move({ origin: rightAnswer })
            .click()
            .perform();

          const stateOptionClick = await testContainer.takeScreenshot();
          await this.browser
            .actions({ bridge: true })
            .sendKeys(this.keys.TAB)
            .perform();

          const stateAfterLossingFocus = await testContainer.takeScreenshot();

          await this.expect({ stateOptionClick, stateAfterLossingFocus }).to.matchImages();
        },

        async checkSwitchingBetweenOptions() {
          const testContainer = await this.browser.findElement({ css: '#test-element' });
          const options = await this.browser.findElements({ css: '[data-comp-name~=Radio]' });
          const dafaultState = await testContainer.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: options[0] })
            .click()
            .perform();

          const stateFirstOptionSelected = await testContainer.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: options[1] })
            .click()
            .perform();

          const stateSecondOptionSelected = await testContainer.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: options[2] })
            .click()
            .perform();

          const stateThirdOptionSelected = await testContainer.takeScreenshot();
          await this.expect({
            dafaultState,
            stateFirstOptionSelected,
            stateSecondOptionSelected,
            stateThirdOptionSelected,
          }).to.matchImages();
        },

        async checkWrongAnswer() {
          const scrin = await this.browser.findElement({ css: '#test-element' });
          const element = await this.browser.findElement({ css: '[data-tid~=option0]' });
          const active = await scrin.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: element })
            .perform();

          const hover = await scrin.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(element)
            .perform();

          const check = await scrin.takeScreenshot();
          const button = await this.browser.findElement({ css: '[data-tid~=checkButton]' });

          await this.browser
            .actions({ bridge: true })
            .click(button)
            .perform();

          await delay(500);
          const error = await scrin.takeScreenshot();
          await this.expect({ active, hover, check, error }).to.matchImages();
        },
      },
    },
  },
};



export const RadioGroupVertical: CSFStory<JSX.Element> = () => (
  <RadioGroup>
    <Gapped vertical gap={10}>
      <Radio value="fd">1</Radio>
      <Radio value="er">2</Radio>
      <Radio value="gs">3</Radio>
    </Gapped>
  </RadioGroup>
);

/**
 * 0. Найти элемент для скриншота
 * 1. Найти элементы списка
 * 2. 📸скриншот дефолтного состояния
 * 3. Навести курсор
 * 4. 📸Скриншот при наведении
 * 5. 📸Нажатие-Скриншот момента нажатия на кнопку
 * 6. 📸Скриншот после нажатия
 * 7. Повторное нажатие
 * 8. 📸Скриншот после повторного нажатия
 * 9. нажатие таба
 * 10. 📸Скриншот без фокуса
 * 11. Выбрать другой пункт
 * 12. 📸Скриншот другого выбора
 *  Profit!
 */

RadioGroupVertical.story = {
  parameters: {
    creevey: {
      tests: {
        async cliksToVerticalElements() {
          // 0. Найти элемент для скриншота
          const element = await this.browser.findElement({ css: '#test-element' });

          // 1. Найти элементы списка
          const button = await this.browser.findElements({ css: '[data-comp-name=Radio]' });

          // 2. Скриншот дефолтного состояния
          const defaultState = await element.takeScreenshot();

          // 3.  Навести курсор
          await this.browser
            .actions({ bridge: true })
            .move({ origin: button[0] })
            .perform();

          // 4. делаем скриншот "при наведении"
          const cursor = await element.takeScreenshot();

          // 5. делаем скриншот "при нажатии"
          await this.browser
            .actions({ bridge: true })
            .move({ origin: button[0] })
            .press(0)
            .perform();

          const click = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .release()
            .perform();

          //6. скриншот после нажатия
          const afterClick = await element.takeScreenshot();

          // 7. повторное нажатие
          await this.browser
            .actions({ bridge: true })
            .click(button[0])
            .perform();

          // 8. скрин после повторного нажатия
          const afterRepiatClick = await element.takeScreenshot();

          // 9. нажатие таба
          await this.browser
            .actions({ bridge: true })
            .sendKeys(this.keys.TAB)
            .perform();

          // 10. скрин без фокуса
          const withoutFocus = await element.takeScreenshot();

          // 11. выбрать другой пункт
          await this.browser
            .actions({ bridge: true })
            .click(button[2])
            .perform();

          // 12. скрин выбора другого элемента
          const otherElement = await element.takeScreenshot();

          // 13. сравниваем результаты
          await this.expect({
            defaultState,
            cursor,
            click,
            afterClick,
            afterRepiatClick,
            withoutFocus,
            otherElement,
          }).to.matchImages();
        },
      },
    },
  },
};
