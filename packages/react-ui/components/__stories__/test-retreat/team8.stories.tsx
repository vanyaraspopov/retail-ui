import { CSFStory } from 'creevey';
import React, { Component } from 'react';

import { Button } from '../../Button';
import { Input } from '../../Input'; // 3
import { Modal } from '../../Modal'; // 3
import { Select } from '../../Select'; // 4
import { Toggle } from '../../Toggle'; // 2

export default {
  title: 'TR 8',
};

export const WithDefaultValue: CSFStory<JSX.Element> = () => (
  <Select width="150px" items={['oneoneone', 'twotwotwo', 'threethree']} defaultValue={'threethree'} />
);
WithDefaultValue.story = {
  name: 'using default value',
  parameters: { creevey: { captureElement: null } },
};

export const Disabled: CSFStory<JSX.Element> = () => (
  <Select width="150px" items={['oneoneone', 'twotwotwo', 'threethree']} disabled />
);
Disabled.story = {
  name: 'disabled',
  parameters: { creevey: { captureElement: null } },
};

export const WithSearch: CSFStory<JSX.Element> = () => (
  <Select width="150px" items={['oneoneone', 'twotwotwo', 'threethree']} search />
);
WithSearch.story = {
  name: 'with search',
  parameters: {
    creevey: {
      tests: {
        async ['search item']() {
          const element = await this.browser.findElement({ css: '.dropdown-test-container' });
          await this.browser
            .actions({ bridge: true })
            .click(await this.browser.findElement({ css: '[data-comp-name~=Select]' }))
            .perform();
          const searchVisible = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .sendKeys('o', 'n', 'e')
            .perform();
          const filtered = await element.takeScreenshot();

          await this.expect({ searchVisible, filtered }).to.matchImages();
        },
      },
    },
  },
};

const notSelectable: React.ReactElement = <span id="notSelectable">Not Selectable</span>;

export const WithNotSelectableValue: CSFStory<JSX.Element> = () => (
  <Select<any>
    width="150px"
    // @ts-ignore
    items={[Select.static(() => <Select.Item>{notSelectable}</Select.Item>), 'oneoneone', 'threethree']}
  />
);
WithNotSelectableValue.story = {
  name: 'not selectable value',
  parameters: {
    creevey: {
      tests: {
        async ['try click on not selectable']() {
          const element = await this.browser.findElement({ css: '.dropdown-test-container' });
          await this.browser
            .actions({ bridge: true })
            .click(await this.browser.findElement({ css: '[data-comp-name~=Select]' }))
            .perform();
          await this.browser
            .actions({ bridge: true })
            .move({ origin: this.browser.findElement({ id: 'notSelectable' }) })
            .perform();
          const notHovered = await element.takeScreenshot();

          await this.browser
            .actions({ bridge: true })
            .click(this.browser.findElement({ id: 'notSelectable' }))
            .perform();
          const notClickable = await element.takeScreenshot();

          await this.expect({ notHovered, notClickable }).to.matchImages();
        },
      },
    },
  },
};

class Simple extends React.Component<any, any> {
  public state = {
    checked: true,
  };

  public render() {
    return (
      <div>
        <Toggle
          checked={this.state.checked}
          onValueChange={() => {
            const { checked } = this.state;
            this.setState({ checked: !checked });
          }}
        />{' '}
        {this.state.checked ? 'On' : 'Off'}
      </div>
    );
  }
}

export const Plain: CSFStory<JSX.Element> = () => <Simple />;
Plain.story = {
  name: 'plain',
  parameters: {
    creevey: {
      tests: {
        async hover() {
          await this.browser
            .actions({
              bridge: true,
            })
            .move({ origin: this.browser.findElement({ css: '[data-comp-name~=Toggle]' }) })
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('hover');
        },
        async focused() {
          await this.browser
            .actions({
              bridge: true,
            })
            .sendKeys(this.keys.TAB)
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('focused');
        },
      },
    },
  },
};

/*=============================*/

export const InputWithPlaceholder: CSFStory<JSX.Element> = () => <Input placeholder="Hold the place!" />;
InputWithPlaceholder.story = {
  name: 'Input with placeholder',
  parameters: {
    creevey: {
      tests: {
        async Plain() {
          await this.expect(await this.takeScreenshot()).to.matchImage('Plain');
        },
        async Focused() {
          await this.browser
            .actions({
              bridge: true,
            })
            .click(this.browser.findElement({ css: 'label' }))
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('Focused');
        },
        async ['With typed text']() {
          await this.browser
            .actions({
              bridge: true,
            })
            .click(this.browser.findElement({ css: 'input' }))
            .sendKeys('Test...')
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('With typed text');
        },
      },
    },
  },
};

class SmallModalOnTop extends Component<{}, {}> {
  public state = {
    opened: false,
  };

  public renderModal() {
    return (
      <Modal onClose={this.close} alignTop>
        <Modal.Header>Modal</Modal.Header>
        <Modal.Body>
          <Button data-tid="modal-content-button">Content Button</Button>
        </Modal.Body>
      </Modal>
    );
  }

  public render() {
    return (
      <div>
        {this.state.opened && this.renderModal()}
        <Button onClick={this.open}>Open modal</Button>
      </div>
    );
  }

  public open = () => {
    this.setState({ opened: true });
  };

  public close = () => {
    this.setState({ opened: false });
  };
}

export const SmallModalOnTheTop: CSFStory<JSX.Element> = () => <SmallModalOnTop />;
SmallModalOnTheTop.story = {
  name: 'Small modal on the Top',
  parameters: {
    creevey: {
      tests: {
        async ['opens from keyboard']() {
          await this.browser
            .actions({
              bridge: true,
            })
            .move({ origin: this.browser.findElement({ css: 'body' }) })
            .press()
            .release()
            .sendKeys(this.keys.TAB, this.keys.ENTER)
            .perform();
          await this.expect(await this.browser.takeScreenshot()).to.matchImage('opens from keyboard');
        },
        async ['closes from keyboard focusing cross']() {
          await this.browser
            .actions({
              bridge: true,
            })
            .move({ origin: this.browser.findElement({ css: 'body' }) })
            .press()
            .release()
            .sendKeys(this.keys.TAB, this.keys.ENTER, this.keys.TAB, this.keys.ENTER)
            .perform();
          await this.expect(await this.browser.takeScreenshot()).to.matchImage('closes from keyboard focusing cross');
        },
        async ['focuses only elements inside']() {
          await this.browser
            .actions({
              bridge: true,
            })
            .move({ origin: this.browser.findElement({ css: 'body' }) })
            .press()
            .release()
            .sendKeys(this.keys.TAB, this.keys.ENTER, this.keys.TAB, this.keys.TAB)
            .pause(1) // otherwise it focuses both cross and the button at once
            .sendKeys(this.keys.TAB)
            .perform();
          await this.expect(await this.browser.takeScreenshot()).to.matchImage('focuses only elements inside');
        },
      },
    },
  },
};
