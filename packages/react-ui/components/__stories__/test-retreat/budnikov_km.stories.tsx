import { CreeveyStoryParams, CSFStory } from 'creevey';
import React from 'react';

import { Autocomplete } from '../../Autocomplete'; // 7

export default {
  title: 'TR budnikov_km',
};

export const BasicAutocomplete: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState('');
  return (
    <div style={{ padding: '4px 200px 200px 4px' }}>
      <Autocomplete source={['one', 'two', 'three']} value={value} onValueChange={updateValue} />
    </div>
  );
};

BasicAutocomplete.story = {
  parameters: {
    creevey: {
      tests: {
        /**
         *  Autocomplete. Независимость от регистра
         *
         *  0. История BasicAutocomplete
         *  1. Найти элемент на странице
         *  2. Фокус на поле ввода
         *  3. Ввести "ONE"
         *  4. 📸 состояние “введенное слово"
         *
         *  Profit!
         */
        async shouldSuggestCaseIndependent() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const input = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });

          await this.browser
            .actions({ bridge: true })
            .click(input)
            .perform();

          await this.browser
            .actions({ bridge: true })
            .sendKeys('ONE')
            .perform();

          const upperCaseTyped = await element.takeScreenshot();

          await this.expect({ typed: upperCaseTyped }).to.matchImages();
        },
        /**
         *  Autocomplete. Обрезает пробелы
         *
         *  0. История BasicAutocomplete
         *  1. Найти элемент на странице
         *  2. Фокус на поле ввода
         *  3. Ввести "   two   "
         *  4. 📸 состояние “введенное слово"
         *
         *  Profit!
         */
        async shouldIgnoreSpacesAfterOrBefore() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const input = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });

          await this.browser
            .actions({ bridge: true })
            .click(input)
            .perform();

          await this.browser
            .actions({ bridge: true })
            .sendKeys('   two   ')
            .perform();

          const typedWithSpaces = await element.takeScreenshot();

          await this.expect({ typed: typedWithSpaces }).to.matchImages();
        },
      },
    },
  },
};

/**/

export const AutocompleteWithScroll: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState('');
  const items = [];
  for (let i = 0; i < 20; i++) {
    items.push(`Abba ${i}`);
  }
  return (
    <div style={{ padding: '4px 200px 200px 4px' }}>
      <Autocomplete source={items} value={value} onValueChange={updateValue} />
    </div>
  );
};

AutocompleteWithScroll.story = {
  parameters: {
    creevey: {
      tests: {
        /**
         *  Autocomplete. При большом количестве вариантов виден скроллбар
         *
         *  0. История AutocompleteWithScroll
         *  1. Найти элемент на странице
         *  2. Фокус на поле ввода
         *  3. Ввести "Abba"
         *  4. 📸 состояние дропдауна со скроллбаром
         *
         *  Profit!
         */
        async scrollBarShouldBeVisible() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const autocomplete = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });

          await this.browser
            .actions({ bridge: true })
            .click(autocomplete)
            .perform();

          await this.browser
            .actions({ bridge: true })
            .sendKeys('Abba')
            .perform();

          const autocompleteWithScroll = await element.takeScreenshot();

          await this.expect({ autocompleteWithScroll }).to.matchImages();
        },
        /**
         *  Autocomplete. Скроллбар расширяется при наведении
         *
         *  0. История AutocompleteWithScroll
         *  1. Найти элемент на странице
         *  2. Фокус на поле ввода
         *  3. Ввести "Abba"
         *  4. Находим скроллбар
         *  5. Наводим на него мышь
         *  6. 📸 состояние скроллбара в дропдауне
         *
         *  Profit!
         */
        async scrollBarShouldEnlargeOnHover() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const autocomplete = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });

          await this.browser
            .actions({ bridge: true })
            .click(autocomplete)
            .perform();

          await this.browser
            .actions({ bridge: true })
            .sendKeys('Abba')
            .perform();

          const scrollBar = await this.browser.findElement({ className: 'react-ui-ejkfzu' });
          await this.browser
            .actions({ bridge: true })
            .move({ origin: scrollBar })
            .perform(); //Hover не работает на IE11
          const scrollBarOnHover = await element.takeScreenshot();

          await this.expect({ scrollBarOnHover }).to.matchImages();
        },
      },
    },
  },
};

export const AutocompleteWithSelectAllOnFocus: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState('');
  return (
    <div style={{ padding: '4px 200px 200px 4px' }}>
      <Autocomplete
        source={['one', 'two', 'three']}
        value={value}
        selectAllOnFocus={true}
        onValueChange={updateValue}
      />
    </div>
  );
};

/**
 *  Autocomplete. При введеном тексте фокус на элементе влечет выделение этого текста
 *
 *  0. История AutocompleteWithSelectAllOnFocus
 *  1. Найти элемент на странице
 *  2. Фокус на поле ввода
 *  3. Ввести "shouldSelectThisTextOnFocus"
 *  4. Нажать TAB для потери фокуса (не проходит на Firefox)
 *  5. Кликаем вновь по полю ввода
 *  6. 📸 состояние поля ввода
 *
 *  Profit!
 */

AutocompleteWithSelectAllOnFocus.story = {
  parameters: {
    creevey: {
      tests: {
        async shouldSelectTextOnFocus() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const autocomplete = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });

          await this.browser
            .actions({ bridge: true })
            .click(autocomplete)
            .perform();

          await this.browser
            .actions({ bridge: true })
            .sendKeys('shouldSelectThisTextOnFocus')
            .sendKeys(this.keys.TAB) //TODO: Не работает в Firefox, нужно либо по другому терять фокус, либо разобраться в чем проблема Firefox
            .perform();

          await this.browser
            .actions({ bridge: true })
            .click(autocomplete)
            .perform();

          const selectedOnFocus = await element.takeScreenshot();

          await this.expect({ selectedOnFocus }).to.matchImages();
        },
      },
    },
  },
};

/**
 *  Autocomplete. Текст вводится с выравниванием по правому краю / по центру
 *
 *  0. История AutocompleteWithRightTextAlignment
 *  1. Найти элемент на странице
 *  2. Фокус на поле ввода
 *  3. Ввести "text"
 *  4. 📸 состояние поля ввода
 *
 *  Profit!
 */

export const AutocompleteWithRightTextAlignment: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState('');
  return (
    <div style={{ padding: '4px 200px 200px 4px' }}>
      <Autocomplete align={'right'} source={['one', 'two', 'three']} value={value} onValueChange={updateValue} />
    </div>
  );
};

const textAlignmentTest: CreeveyStoryParams['tests'] = {
  async textShouldBeAligned() {
    const element = await this.browser.findElement({ css: '#test-element' });
    const input = await this.browser.findElement({ css: '[data-comp-name~=Autocomplete]' });

    await this.browser
      .actions({ bridge: true })
      .click(input)
      .perform();

    await this.browser
      .actions({ bridge: true })
      .sendKeys('text')
      .perform();

    const typed = await element.takeScreenshot();
    await this.expect({ typed }).to.matchImages();
  },
};

AutocompleteWithRightTextAlignment.story = {
  parameters: {
    creevey: {
      tests: textAlignmentTest,
    },
  },
};

export const AutocompleteWithCenterTextAlignment: CSFStory<JSX.Element> = () => {
  const [value, updateValue] = React.useState('');
  return (
    <div style={{ padding: '4px 200px 200px 4px' }}>
      <Autocomplete align={'center'} source={['one', 'two', 'three']} value={value} onValueChange={updateValue} />
    </div>
  );
};

AutocompleteWithCenterTextAlignment.story = {
  parameters: {
    creevey: {
      tests: textAlignmentTest,
    },
  },
};
