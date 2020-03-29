import React, { Component } from 'react';
import { CSFStory } from 'creevey';

import { Checkbox } from '../../Checkbox'; // 17

export default {
  title: 'TR 4',
};

class CheckboxWithErrorClass extends Component<any, any> {
  public state = {
    checked: false,
    error: true,
  };

  public render() {
    const { checked, error } = this.state;
    return (
      <Checkbox error={error}
                onValueChange={() => this.setState({ checked: !checked })}
                checked={checked}>
        {this.props.children}
      </Checkbox>
    );
  }
}

export const CheckboxWithError: CSFStory<JSX.Element> = () => <CheckboxWithErrorClass>CheckboxWithError</CheckboxWithErrorClass>;
CheckboxWithError.story = {
  name: 'checkboxWithError',
  parameters: {
    creevey: {
      skip: [{ in: ['ie11', 'ie11Flat'], tests: 'hovered' }],
      tests: {
        async idle() {
          await this.expect(await this.takeScreenshot()).to.matchImage('idle');
        },
        async hovered() {
          await this.browser
            .actions({
              bridge: true,
            })
            .move({
              origin: this.browser.findElement({ css: 'span' }),
            })
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('hovered');
        },
        async clicked() {
          await this.browser
            .actions({
              bridge: true,
            })
            .click(this.browser.findElement({ css: 'span' }))
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('clicked');
        },
        async tabPress() {
          await this.browser
            .actions({
              bridge: true,
            })
            .click(this.browser.findElement({ css: 'span' }))
            .perform();
          await this.browser
            .actions({
              bridge: true,
            })
            .move({ origin: this.browser.findElement({ css: 'body' }) })
            .press()
            .release()
            .sendKeys(this.keys.TAB)
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('tabPress');
        },
        async spacePressAfterClick() {
          await this.browser
            .actions({
              bridge: true,
            })
            .click(this.browser.findElement({ css: '#test-element' }))
            .perform();
          await this.browser
            .actions({ bridge: true })
            .sendKeys(this.keys.SPACE)
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('spacePress');
        },
        async doubleSpacePressAfterClick() {
          await this.browser
            .actions({
              bridge: true,
            })
            .click(this.browser.findElement({ css: '#test-element' }))
            .perform();
          await this.browser
            .actions({ bridge: true })
            .sendKeys(this.keys.SPACE)
            .perform();
          await this.browser
            .actions({ bridge: true })
            .sendKeys(this.keys.SPACE)
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('doubleSpacePress');
        },
      },
    },
  },
};

class CheckboxWithTextClass extends Component<any, any> {
  public state = {
    checked: false,
  };

  public render() {
    const { checked } = this.state;
    return (
      <Checkbox onValueChange={() => this.setState({ checked: !checked })} checked={checked}>
        {this.props.children}
      </Checkbox>
    );
  }
}

export const CheckboxWithText: CSFStory<JSX.Element> = () => (
  <CheckboxWithTextClass>
    <div data-tid="text">CheckboxWithText</div>
  </CheckboxWithTextClass>
);

/**
 *  Checkbox.
 *
 *  0. История CheckboxWithText
 *  1. Найти на странице текст у чекбокса
 *  2. Фокус на текст чекбокса
 *  3. 📸 состояние "не выбран и в фокусе"
 *  4. Нажимаем на текст чекбоса
 *  5. 📸 состояние "нажат и выбран"
 *  6. Отжимаем
 *  7. 📸 состояние "выбран и в фокусе"
 *  8. Снимаем фокус
 *  9. 📸 состояние "выбран и не в фокусе"
 *
 *  Profit!
 */

CheckboxWithText.story = {
  parameters: {
    creevey: {
      tests: {
        async idle() {
          await this.expect(await this.takeScreenshot()).to.matchImage('idle');
        },
        async hoverOnLabel() {
          const label = await this.browser.findElement({ css: '[data-tid~=text]' });
          await this.browser
            .actions({
              bridge: true,
            })
            .move({
              origin: label,
            })
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('hoverOnLabel');
        },
      },
    },
  },
};

class CheckboxWithIndeterminateState extends Component<any, any> {
  state = {
    checked: false,
    initialIndeterminate: true,
  };

  public render() {
    const { checked, initialIndeterminate } = this.state;
    return (
      <Checkbox
        initialIndeterminate={initialIndeterminate}
        onValueChange={() => this.setState({ checked: !checked })}
        checked={checked}
      >
        {this.props.children}
      </Checkbox>
    );
  }
}

export const SimpleCheckbox: CSFStory<JSX.Element> = () => (
  <CheckboxWithIndeterminateState>Click me </CheckboxWithIndeterminateState>
);

CheckboxWithText.story = {
  parameters: {
    creevey: {
      tests: {
        async idle() {
          await this.expect(await this.takeScreenshot()).to.matchImage('idle');
        },
        async hoverOnLabel() {
          const label = await this.browser.findElement({ css: '[data-tid~=text]' });
          await this.browser
            .actions({
              bridge: true,
            })
            .move({
              origin: label,
            })
            .perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('hoverOnLabel');
        },
        async pressOnLabel() {
          const label = await this.browser.findElement({ css: '[data-tid~=text]' });
          await this.browser.
          actions({
            bridge: true
          }).
          move({
            origin: label,
          }).
          press(0).
          perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('pressOnLabel');
        },
        async stayHoveredAfterCheck() {
          const label = await this.browser.findElement({ css: '[data-tid~=text]' });
          await this.browser.
          actions({
            bridge: true
          }).
          click(label).
          move({
            origin: label,
          }).
          perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('stayHoveredAfterCheck');
        },
        async stayHoveredAfterUncheck() {
          const label = await this.browser.findElement({ css: '[data-tid~=text]' });
          await this.browser.
          actions({
            bridge: true
          }).
          move({
            origin: label,
          }).
          click(label).
          click(label).
          perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('stayHoveredAfterUncheck');
        },
        async pressWhenChecked() {
          const label = await this.browser.findElement({ css: '[data-tid~=text]' });
          await this.browser.
          actions({
            bridge: true
          }).
          click(label).
          move({
            origin: label,
          }).
          press().
          perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('pressWhenChecked');
        },
        async unhoveredWhenUncheckAfterMoveOver() {
          const label = await this.browser.findElement({ css: '[data-tid~=text]' });
          await this.browser.
          actions({
            bridge: true
          }).
          move({
            origin: label,
          }).
          click(label).
          click(label).
          move({ origin: this.browser.findElement({ css: 'body' }) }).
          perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('unhoveredWhenUncheckAfterMoveOver');
        },
        async stayUncheckedAfterDragAndDrop() {
          const label = await this.browser.findElement({ css: '[data-tid~=text]' });
          await this.browser.
          actions({
            bridge: true
          }).
          move({
            origin: label,
          }).
          press(0).
          move({ origin: this.browser.findElement({ css: 'body' }) }).
          release(0).
          perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('stayUncheckedAfterDragAndDrop');
        },
        async stayCheckedAfterDragAndDrop() {
          const label = await this.browser.findElement({ css: '[data-tid~=text]' });
          await this.browser.
          actions({
            bridge: true
          }).
          move({
            origin: label,
          }).
          click(label).
          press(0).
          move({ origin: this.browser.findElement({ css: 'body' }) }).
          release(0).
          perform();
          await this.expect(await this.takeScreenshot()).to.matchImage('stayCheckedAfterDragAndDrop');
        },
      }
    }
  }
};
