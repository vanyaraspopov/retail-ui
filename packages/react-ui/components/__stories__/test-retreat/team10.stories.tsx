import { CSFStory } from 'creevey';
import React from 'react';

import { Autocomplete } from '../../Autocomplete'; // 4

export default {
  title: 'TR 10',
};

const BASIC_AUTOCOMPLETE_ITEMS = ['one', 'two', 'three'];


export const BasicAutocomplete: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState('');
  return (
    <div style={{ padding: '4px 200px 200px 4px' }}>
      <Autocomplete source={['one', 'two', 'three']} value={value} onValueChange={updateValue} />
    </div>
  );
};

/**
 *  Autocomplete. Выбор значения по Enter
 *
 *  0. История BasicAutocomplete
 *  1. Найти элемент на странице
 *  2. Фокус на поле ввода
 *  3. 📸 состояние "в фокусе"
 *  4. Ввести символ "о"
 *  5. 📸 состояние “введенный символ”
 *  6. Нажать клавишу ARROW_DOWN
 *  7. 📸 состояние “подсвечен первый элемент”
 *  8. Нажать клавишу ENTER
 *  9. 📸 состояние “выбран элемент”
 *
 *  Profit!
 */

BasicAutocomplete.story = {
  parameters: {
    creevey: {
      tests: {
        async itemNotFound() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const input = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });

          await this.browser
            .actions({ bridge: true })
            .click(input)
            .sendKeys('a', this.keys.ARROW_DOWN)
            .perform();

          const absent = await element.takeScreenshot();

          await this.expect({ absent }).to.matchImages();
        },

        async itemNotFoundAfterFillExtraChar() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const input = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });

          await this.browser
            .actions({ bridge: true })
            .click(input)
            .sendKeys('o', this.keys.ARROW_DOWN)
            .perform();

          const highlighted = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .sendKeys('!', this.keys.ARROW_DOWN)
            .perform();

          const absent = await element.takeScreenshot();

          await this.expect({ highlighted, absent }).to.matchImages();
        },

        async itemtFoundAfterFixMisprint() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const input = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });

          await this.browser
            .actions({ bridge: true })
            .click(input)
            .sendKeys('ob', this.keys.ARROW_DOWN)
            .perform();

          const absent = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .sendKeys(this.keys.BACK_SPACE, this.keys.ARROW_DOWN, this.keys.ENTER)
            .perform();

          const selected = await element.takeScreenshot();

          await this.expect({ absent, selected }).to.matchImages();
        },

        async firstItemSelectedAfterLast() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const input = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });
          const typedText = 'o';

          await this.browser
            .actions({ bridge: true })
            .click(input)
            .sendKeys(typedText)
            .perform();

          const filteredItemsLength = BASIC_AUTOCOMPLETE_ITEMS.filter(item =>
            item
              .trim()
              .toLowerCase()
              .includes(typedText),
          ).length;
          const arrowDownKeysArray: string[] = Array(filteredItemsLength + 1).fill(this.keys.ARROW_DOWN);

          await this.browser
            .actions({ bridge: true })
            .sendKeys(...arrowDownKeysArray, this.keys.ENTER)
            .perform();

          const selected = await element.takeScreenshot();

          await this.expect({ selected }).to.matchImages();
        },
      },
    },
  },
};
