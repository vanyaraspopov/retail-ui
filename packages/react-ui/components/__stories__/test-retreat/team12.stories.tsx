import { CSFStory } from 'creevey';
import React from 'react';

import { Checkbox } from '../../Checkbox'; // 1
import { Hint } from '../../Hint';

export default {
  title: 'TR 12',
};

/**
 *  Hint. Хинт появляется при наведении курсора на элемент
 *
 *  0. История TextWithHint
 *  1. Найти элемент на странице
 *  2. 📸 хинт отсутствует
 *  3. Навести на элемент
 *  4. 📸 хинт появился
 *  5. Убрать курсор с элемента
 *  6. 📸 хинт исчез
 *  Profit!
 */

export const SimpleHint: CSFStory<JSX.Element> = () => {
  return <Hint text="World">Hello</Hint>;
};
//В storybook не анимируется hint при наведении на него

export const UnaryCheckbox: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState(false);
  return (
    <Checkbox checked={value} onValueChange={updateValue}>
      Check it out!
    </Checkbox>
  );
};

/**
 *  Checkbox. Ховер и смена состояния
 *
 *  0. История CheckBox
 *  1. Найти элемент на странице
 *  2. 📸 дефолтное состояние
 *  3. Навести мышь на чекбокс
 *  4. 📸 состояние "hovered"
 *  5. Выбрать чекбокс
 *  6. 📸 состояние "checked"
 *  Profit!
 */

UnaryCheckbox.story = {
  parameters: {
    creevey: {
      tests: {
        async ChangeState() {
          // 1. находим элемент для скриншота
          const element = await this.browser.findElement({ css: '#test-element' });

          // 2. делаем скриншот "по умолчанию"
          const uncheckedUnhovered = await element.takeScreenshot();

          // находим чекбокс
          const checkbox = await this.browser.findElement({ css: '[data-comp-name~=Checkbox]' });

          // 3. наводим указатель мыши
          await this.browser
            .actions({ bridge: true })
            .move({ origin: checkbox })
            .perform();

          // 4. делаем скриншот "при наведении"
          const hovered = await element.takeScreenshot();

          // 5. выбираем чекбокс
          await this.browser
            .actions({ bridge: true })
            .click(checkbox)
            .perform();

          // 6. делаем скриншот после выбора чекбокса
          const checked = await element.takeScreenshot();
          await this.expect({ uncheckedUnhovered, hovered, checked }).to.matchImages();
        },
      },
    },
  },
};
