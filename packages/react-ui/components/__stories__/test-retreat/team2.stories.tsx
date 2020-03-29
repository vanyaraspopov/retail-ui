import { CSFStory } from 'creevey';
import React, { useState } from 'react';

import { Hint } from '../../Hint'; // 1
import { Input } from '../../Input'; // 1

export default { title: 'TR 2' };


export const InputWithError: CSFStory<JSX.Element> = () => {
  const [value, setValue] = useState<string>('');
  const isError = value === 'error';
  const disabled = value === 'disabled';

  return (
    <section>
      <Input
        value={value}
        error={isError}
        disabled={disabled}
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

InputWithError.story = {
  parameters: {
    creevey: {
      tests: {
        async itemSelected() {
          const element = await this.browser.findElement({ css: '#test-element' });
          const input = await this.browser.findElement({ css: '[data-comp-name~=Input]' });

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
            .sendKeys('disabled')
            .perform();

          const disabled = await element.takeScreenshot();

          await this.expect({ focused, typed, withError, disabled }).to.matchImages();
        },
      },
    },
  },
};

const changingTextTimeout = 0;

export const HintTest: CSFStory<JSX.Element> = () => {
  let timeout: number;
  const [value, updateValue] = React.useState('short');
  const [trigger, updateTrigger] = React.useState(1);
  const [isOpened, updateIsOpened] = React.useState(false);

  const onClick = () => {
    updateIsOpened(!isOpened);
    updateValue('short');

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      updateTrigger(trigger + 1);
      updateValue('new long value after programmatically changing');
    }, changingTextTimeout);
  };

  return (
    <>
      <div
        style={{
          padding: '5px 5px 5px 5px',
          position: 'absolute',
          border: '1px solid black',
          right: '50%',
          top: '100px',
        }}
      >
        <Hint text={value} pos="top" disableAnimations manual opened>
          hint here
        </Hint>
      </div>
      <div
        id="hint-wrapper"
        style={{
          padding: '80px 5px 5px 160px',
          position: 'absolute',
          border: '1px solid black',
          right: '0',
          top: '100px',
        }}
      >
        <Hint text={value} pos="top" disableAnimations manual opened={isOpened}>
          <div id="hint-trigger" onClick={onClick} key={trigger} style={{ border: '1px solid black' }}>
            hint here
          </div>
        </Hint>
      </div>
    </>
  );
};

HintTest.story = {
  parameters: {
    creevey: {
      tests: {
        async hintNearWindowBorderAfterTextChanging() {
          const hintTrigger = await this.browser.findElement({ css: '#hint-trigger' });
          const hintWrapper = await this.browser.findElement({ css: '#hint-wrapper' });

          await this.browser
            .actions({ bridge: true })
            .click(hintTrigger)
            .perform();
          await new Promise(r => setTimeout(r, changingTextTimeout));

          const hintedElement = await hintWrapper.takeScreenshot();

          await this.expect({ hintedElement }).to.matchImages();
        },
      },
    },
  },
};
