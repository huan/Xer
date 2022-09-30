import { actions, createMachine, interpret } from 'xstate';

const datingPitchesMachine = createMachine(
  {
    id: 'datingPitches',
    initial: 'matched',
    states: {
      matched: {
        // once matched, send out the first pitch immediately, move to firstPitched state
        entry: ['sendFirstPitch'],
        always:[{ target: 'firstPitched'}]
      },
      firstPitched: {
        // wait for WAITINGTIME
        // if no response, move to failure
        // otherwise, send the second message and move to secondPitched state
        after: {
          6000: 'failure'
        },
        on: {
          REPLY: { target: 'secondPitched', actions: ['sendSecondPitch'] },
        },
      },
      secondPitched: {
        // wait for WAITINGTIME
        // if no response, move to failure
        // otherwise, send coffee meet request and move to coffeeRequested state
        after: {
          6000: 'failure'
        },
        on: {
          REPLY: { target: 'coffeeRequested', actions: ['requestCoffeeMeet'] },
        },
      },
      coffeeRequested: {
        // wait for WAITINGTIME
        // if no response, move to failure
        // else if request is rejected, move to failure
        // otherwise, move to success
        after: {
          6000: 'failure'
        },
        on: {
          REJECT: { target: 'failure' },
          ACCEPT: { target: 'success' },
        },
      },
      success: {type: 'final'},
      failure: {},
    }
  },
  {
    actions: {
      // action implementations
      sendFirstPitch: (context, event) => {
        console.log('Hi, my name is Xer. How are you?');
      },
      sendSecondPitch: (context, event) => {
        console.log('How is your day?');
      },
      requestCoffeeMeet: (context, event) => {
        console.log('Do you wanna grab coffee some day?');
      },
    }
  }
);

const datingPitchesService = interpret(datingPitchesMachine).onTransition((state) =>
  console.log(state.value)
);

// Start the service
datingPitchesService.start();
// => 'matched'

datingPitchesService.send({ type: 'REPLY' });

datingPitchesService.send({ type: 'REPLY' });

datingPitchesService.send({ type: 'ACCEPT' });