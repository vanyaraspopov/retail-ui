import { CSFStory } from 'creevey';
import React from 'react';

import { Checkbox } from '../../Checkbox'; // 9

export default { title: 'TR 1' };

export const ClickDisabled: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState(false);
  return (
    <Checkbox checked={value} onValueChange={updateValue} disabled>
      text
    </Checkbox>
  );
};
/**
 * Checkbox. Клик по заблокированному чекбоксу
 *
 * - 📸 дефолтное состояние
 * - Клик по чекбоксу
 * - 📸 состояние после клика
 */
ClickDisabled.story = {
  parameters: {
    creevey: {
      tests: {
        async clickDisabled() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const checkbox = await this.browser.findElement({ css: '[data-comp-name~=Checkbox]' });

          const idle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(checkbox)
            .perform();

          const afterClicked = await element.takeScreenshot();

          await this.expect({ idle, afterClicked }).to.matchImages();
        },
      },
    },
  },
};

export const ClickCheckbox: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState(false);
  return (
    <Checkbox checked={value} onValueChange={updateValue}>
      text
    </Checkbox>
  );
};
/**
 * Checkbox. Ставим и снимаем галочку кликом
 *
 * - 📸 дефолтное состояние
 * - Клик по чекбоксу
 * - 📸 состояние “выбран чекбокс”
 * - Клик по чекбоксу
 * - 📸 состояние “не выбран чекбокс”
 */
ClickCheckbox.story = {
  parameters: {
    creevey: {
      tests: {
        async itemSelected() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const checkbox = await this.browser.findElement({ css: '[data-comp-name~=Checkbox]' });

          const idle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(checkbox)
            .perform();

          const afterClicked = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(checkbox)
            .perform();

          const afterTwoClicked = await element.takeScreenshot();

          await this.expect({ idle, afterClicked, afterTwoClicked }).to.matchImages();
        },
      },
    },
  },
};

export const WarningCheckbox: CSFStory<JSX.Element> = () => {
  const [checked, update] = React.useState(true);
  return (
    <Checkbox warning checked={checked} onValueChange={update}>
      text
    </Checkbox>
  );
};
/**
 * Checkbox. Клик по чекбоксу в состоянии "выбран" и подсветкой "warning"
 *
 * - Клик по чекбоксу
 * - 📸 состояние “не выбран чекбокс”
 */
WarningCheckbox.story = {
  parameters: {
    creevey: {
      tests: {
        async warningChecked() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const checkbox = await this.browser.findElement({ css: '[data-comp-name~=Checkbox]' });

          const idle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(checkbox)
            .perform();

          const unchecked = await element.takeScreenshot();

          await this.expect({ idle, unchecked }).to.matchImages();
        },
      },
    },
  },
};


/* polunina*/


export const BasicCheckbox: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState(false);
  return (
    <Checkbox
      checked={value}
      onValueChange={updateValue}
    >
      text
    </Checkbox>
  )
};

/**
 *  CheckBox. Состояние “hover”
 *
 *  0. История CheckBox
 *  1. Найти элемент на странице
 *  2. 📸 дефолтное состояние
 *  3. Навести мышь на CheckBox
 *  4. 📸 состояние “hover”
 *  5. Наблюдаем изменение цвета фона
 *
 *  Profit!
 */

BasicCheckbox.story = {
  parameters: {
    creevey: {
      tests: {
        async itemSelected() {
          // 1. находим элемент для скриншота
          const element = await this.browser.findElement({ css: "#test-element" });
          // находим чекбокс
          const checkbox = await this.browser.findElement({ css: "[data-comp-name~=Checkbox]" });
          // 2. делаем скриншот "по умолчанию"
          const idle = await element.takeScreenshot();

          // 3. наводим указатель мыши
          await this.browser
            .actions({ bridge: true })
            .move({ origin: checkbox })
            .perform();

          // 4. делаем скриншот "при наведении"
          const afterClicked = await element.takeScreenshot();
          // 5. сравниваем результаты
          await this.expect({ idle, afterClicked }).to.matchImages();
        }
      }
    }
  }
};

export const CheckboxLongValue: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState(false);
  return (
    <>
      <div>
        <Checkbox
          checked={value}
          onValueChange={updateValue}
        >
          long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text long text
        </Checkbox>
      </div>
      <div>
        <Checkbox
          checked={value}
          onValueChange={updateValue}
        >
        </Checkbox>
      </div>
    </>
  )
};

/**
 *  CheckBox. Состояние “Длиинный текст и еще один чекбокс”
 *
 *  0. 📸 дефолтное состояние
 *
 *  Profit!
 */

CheckboxLongValue.story = {
  parameters: {
    creevey: {
      tests: {
        async itemSelected() {
          // 1. находим элемент для скриншота
          const element = await this.browser.findElement({ css: "#test-element" });
          // 2. делаем скриншот "по умолчанию"
          const idle = await element.takeScreenshot();
          // 3. сравниваем результаты
          await this.expect({ idle }).to.matchImages();
        }
      }
    }
  }
};

export const IndeterminateCheckbox: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState(false);
  return (
    <Checkbox
      checked={value}
      onValueChange={updateValue}
      initialIndeterminate
    >
      text
    </Checkbox>
  )
};

/**
 *  CheckBox. Состояние из промежуточного в checked
 *
 *  0. История CheckBox
 *  1. Найти элемент на странице
 *  2. 📸 дефолтное состояние - промежуточное
 *  3. Кликнуть на CheckBox
 *  4. 📸 состояние “checked”
 *  5. Наблюдаем изменение состояния
 *
 *  Profit!
 */

IndeterminateCheckbox.story = {
  parameters: {
    creevey: {
      tests: {
        async itemSelected() {
          // 1. находим элемент для скриншота
          const element = await this.browser.findElement({ css: "#test-element" });
          // находим чекбокс
          const checkbox = await this.browser.findElement({ css: "[data-comp-name~=Checkbox]" });
          // 2. делаем скриншот "по умолчанию"
          const idle = await element.takeScreenshot();

          // 3. кликаем на  checkbox
          await this.browser
            .actions({ bridge: true })
            .click(checkbox)
            .perform();

          // 4. делаем скриншот "checked"
          const afterClicked = await element.takeScreenshot();
          // 5. сравниваем результаты
          await this.expect({ idle, afterClicked }).to.matchImages();
        }
      }
    }
  }
};
