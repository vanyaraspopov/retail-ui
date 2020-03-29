import { CreeveyStoryParams, CSFStory } from 'creevey';
import React from 'react';

import { OkIcon } from '../../../internal/icons/16px';
import { Link } from '../../Link'; // 13

export default {
  title: 'TR 5',
};

export const LinkDefault: CSFStory<JSX.Element> = () => {
  return <Link>Enabled</Link>;
};

export const LinkWithIcon: CSFStory<JSX.Element> = () => {
  return <Link icon={<OkIcon />}>OK</Link>;
};

export const LinkWithSpaces: CSFStory<JSX.Element> = () => {
  return <Link>Link with spaces</Link>;
};

export const LinkSuccess: CSFStory<JSX.Element> = () => {
  return <Link use="success">Link with spaces</Link>;
};

export const LinkDanger: CSFStory<JSX.Element> = () => {
  return <Link use="danger">Link with spaces</Link>;
};

export const LinkGrayed: CSFStory<JSX.Element> = () => {
  return <Link use="grayed">Link with spaces</Link>;
};

/**
 * Link
 *
 * 0. Истории Link*
 * 1. Найти элемент на странице
 * 2. Сделать скриншот дефолтного состояния
 * 3. Навести курсор на ссылку
 * 4. Сделать скриншот состояния hover
 * 5. Нажать на ссылку
 * 6. Сделать скриншот состояния pressed/mouseDown
 * 7. Отпустить ссылку
 * 8. Сделать скриншот состояния hover
 */

const linkTests: CreeveyStoryParams['tests'] = {
  async pressedThenReleased() {
    const element = await this.browser.findElement({ css: '#test-element' });
    const link = await this.browser.findElement({ css: '[data-comp-name~=Link]' });

    const idle = await element.takeScreenshot();

    await this.browser
      .actions({ bridge: true })
      .move({ origin: link })
      .perform();

    const hover = await element.takeScreenshot();

    await this.browser
      .actions({ bridge: true })
      .press()
      .perform();

    const pressed = await element.takeScreenshot();

    await this.browser
      .actions({ bridge: true })
      .release()
      .perform();

    const released = await element.takeScreenshot();

    await this.expect({ idle, hover, pressed, released }).to.matchImages();
  },
  async focused() {
    const element = await this.browser.findElement({ css: '#test-element' });

    await this.browser
      .actions({ bridge: true })
      .sendKeys(this.keys.TAB)
      .perform();

    const focused = await element.takeScreenshot();

    await this.expect({ focused }).to.matchImages();
  },
};

LinkDefault.story = { parameters: { creevey: { tests: linkTests } } };

LinkWithIcon.story = { parameters: { creevey: { tests: linkTests } } };

LinkWithSpaces.story = { parameters: { creevey: { tests: linkTests } } };

LinkSuccess.story = { parameters: { creevey: { tests: linkTests } } };

LinkDanger.story = { parameters: { creevey: { tests: linkTests } } };

LinkGrayed.story = { parameters: { creevey: { tests: linkTests } } };

/**
 * Link
 *
 * 0. История LinkDisabled
 * 1. Найти элемент на странице
 * 2. Сделать скриншот задизабленного состояния
 * 3. Навести курсор на ссылку
 * 4. Сделать скриншот состояния hover
 */

export const LinkDisabled: CSFStory<JSX.Element> = () => {
  return <Link disabled={true}>Disabled</Link>;
};

LinkDisabled.story = {
  parameters: {
    creevey: {
      tests: {
        async hover() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const link = await this.browser.findElement({ css: '[data-comp-name~=Link]' });

          const idle = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .move({ origin: link })
            .perform();

          const hover = await element.takeScreenshot();

          await this.expect({ idle, hover }).to.matchImages();
        },
      },
    },
  },
};
