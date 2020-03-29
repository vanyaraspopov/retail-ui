import { CSFStory } from 'creevey';
import React from 'react';
import { WebDriver } from 'selenium-webdriver';
import until from 'selenium-webdriver/lib/until';

import { Button } from '../../Button';
import { Link } from '../../Link'; // 1
import { Tabs } from '../../Tabs'; // 3
import { Toast } from '../../Toast'; // 2
import { Toggle } from '../../Toggle'; // 1

export default {
  title: 'TR 9',
};

// Utils

/**
 * Ожидает, пока пройдёт указанное кол-во милисекунд
 *
 * @param driver
 * @param msTime
 */
async function sleep(driver: WebDriver, msTime: number) {
  let isDone = false;
  setTimeout(() => (isDone = true), msTime);
  await driver.wait(() => isDone, msTime);
}

export const BasicLink: CSFStory<JSX.Element> = () => {
  return (
    <div style={{ marginTop: '20px' }}>
      <Link href="#">Base link</Link>
    </div>
  );
};

/**
 *  Link. Клик по ссылке
 *
 *  0. История BasicLink
 *  1. Найти элемент на странице
 *  2. Наведение на ссылку
 *  3. 📸 состояние "hover"
 *  4. Нажать клавишу MOUSE_DOWN
 *  5. 📸 состояние “зажатая кнопка мыши”
 *  4. Нажать клавишу MOUSE_UP
 *  5. 📸 состояние “кликнули по ссылке”
 *
 *  Profit!
 */

BasicLink.story = {
  parameters: {
    creevey: {
      tests: {
        async itemSelected() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const link = await this.browser.findElement({ css: 'a' });

          const started = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: link })
            .perform();

          const hovered = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .press()
            .perform();

          const pressed = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click()
            .perform();

          const clicked = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ x: 0, y: 0 })
            .perform();

          const activated = await element.takeScreenshot();

          await this.expect({ started, hovered, pressed, clicked, activated }).to.matchImages();
        },
      },
    },
  },
};

export const BasicToggle: CSFStory<JSX.Element> = () => {
  const initialState = false;
  const [checked, checkSet] = React.useState(initialState);
  const toggleCheck = () => {
    checkSet(!checked);
  };
  return (
    <div>
      <Toggle checked={checked} onChange={toggleCheck} /> {checked ? 'On' : 'Off'}
    </div>
  );
};

/**
 * Toggle. Переключение
 *
 *  0. История BasicToggle
 *  1. Найти элемент на странице
 *  2. 📸 дефолтное состояние
 *  3. Навести мышь на переключатель
 *  4. 📸 состояние “hover”
 *  5. Фокус на переключателе
 *  6. 📸 состояние "в фокусе"
 *  7. Кликнуть на переключатель
 *  8. 📸 состояние "включен"
 *  Profit!
 */

BasicToggle.story = {
  parameters: {
    creevey: {
      tests: {
        async toggleItem() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const inputLabel = await this.browser.findElement({ css: 'label' });

          const defaultToggle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: inputLabel })
            .perform();

          const hoverToggle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: inputLabel })
            .press()
            .perform();

          const focusToggle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(inputLabel)
            .perform();

          const toggled = await element.takeScreenshot();

          await this.expect({ defaultToggle, hoverToggle, focusToggle, toggled }).to.matchImages();
        },
      },
    },
  },
};

export const SimpleTabs: CSFStory<JSX.Element> = () => {
  const initialState = 'first';
  const [current, currentSet] = React.useState(initialState);
  const changeHandler = (value: string) => currentSet(value);

  return (
    <Tabs value={current} onValueChange={changeHandler}>
      <Tabs.Tab id="first">first</Tabs.Tab>
      <Tabs.Tab disabled id="second">
        second (disabled)
      </Tabs.Tab>
      <Tabs.Tab id="third">third</Tabs.Tab>
    </Tabs>
  );
};

/**
 * Tabs. Выбор нужного таба
 *
 *  0. История BasicToggle
 *  1. Найти элемент на странице
 *  2. 📸 дефолтное состояние
 *  3. Навести мышь на таб
 *  4. 📸 состояние “hover”
 *  5. Фокус на табе
 *  6. 📸 состояние "в фокусе"
 *  7. Кликнуть на таб
 *  8. 📸 состояние "включен"
 *
 *  Profit!
 */

SimpleTabs.story = {
  parameters: {
    creevey: {
      tests: {
        async selectTab() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const thirdTab = await this.browser.findElement({ css: 'a[data-prop-id~=third]' });

          const defaultToggle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: thirdTab })
            .perform();

          const hoverTab = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(thirdTab)
            .perform();

          const activeTabChanged = await element.takeScreenshot();

          await this.expect({ defaultToggle, hoverTab, activeTabChanged }).to.matchImages();
        },

        async selectDisabledTab() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const secondTab = await this.browser.findElement({ css: 'a[data-prop-id~=second]' });

          const defaultToggle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: secondTab })
            .perform();

          const hoverTab = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(secondTab)
            .perform();

          const activeTabChanged = await element.takeScreenshot();

          await this.expect({ defaultToggle, hoverTab, activeTabChanged }).to.matchImages();
        },

        async selectActiveTab() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const firstTab = await this.browser.findElement({ css: 'a[data-prop-id~=first]' });

          const defaultToggle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: firstTab })
            .perform();

          const hoverTab = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(firstTab)
            .perform();

          const activeTabChanged = await element.takeScreenshot();

          await this.expect({ defaultToggle, hoverTab, activeTabChanged }).to.matchImages();
        },
      },
    },
  },
};

export const ComplexToast: CSFStory<JSX.Element> = () => {
  function showComplexNotification() {
    Toast.push('Successfully saved', {
      label: 'Cancel',
      handler: () => Toast.push('Canceled'),
    });
  }

  return (
    <div style={{ height: '100px', width: '100vw' }} id="test-element-wrapper">
      <Button onClick={showComplexNotification}>Show notification</Button>
    </div>
  );
};

/**
 * ComplexToast. Тост с действиями
 *
 * 0. История showToast
 * 1. Найти контрол вызова тоста
 * 2. Клик по контролу
 * 3. 📸 тост появился
 *
 * 0. История hideToast
 * 1. Найти контрол вызова тоста
 * 2. Клик по контролу
 * 3. Тост появился
 * 4. 📸 спустя 7сек тост закрылся
 * 5. Клик по контролу
 * 6. Тост появился
 * 7. Навести мышь на тост
 * 8. 📸 спустя 7сек тост не закрылся
 *
 *  Profit!
 */

ComplexToast.story = {
  parameters: {
    creevey: {
      tests: {
        async showToast() {
          const element = await this.browser.findElement({ css: '#test-element-wrapper' });
          const toastControl = await this.browser.findElement({ css: 'button' });

          await this.browser
            .actions({ bridge: true })
            .click(toastControl)
            .perform();

          await this.browser.wait(until.elementLocated({ css: '[data-tid~="ToastView__root"]' }), 3000);
          const toastToggled = await element.takeScreenshot();

          await this.expect({ toastToggled }).to.matchImages();
        },

        async hideToast() {
          const element = await this.browser.findElement({ css: '#test-element-wrapper' });
          const toastControl = await this.browser.findElement({ css: 'button' });

          await this.browser
            .actions({ bridge: true })
            .click(toastControl)
            .perform();

          await this.browser.wait(until.elementLocated({ css: '[data-tid~="ToastView__root"]' }), 3000);
          await sleep(this.browser, 7000);

          const toastClosedTimeout = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(toastControl)
            .perform();

          const toast = await this.browser.wait(until.elementLocated({ css: '[data-tid~="ToastView__root"]' }), 3000);
          await this.browser
            .actions({ bridge: true })
            .move({ origin: toast })
            .perform();

          await sleep(this.browser, 7000);
          const toastNotClosingOnHover = await element.takeScreenshot();

          await this.expect({ toastClosedTimeout, toastNotClosingOnHover }).to.matchImages();
        },
      },
    },
  },
};
