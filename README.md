# Finite State Machine

Expands on the simple Finite State Machine written by Bytebit. Written for roblox-ts. Contributions by Morgan Dilling add guard statements and state data storing.

## Installation
### roblox-ts
Simply install to your [roblox-ts](https://roblox-ts.com/) project as follows:
```
npm i @rbxts/finite-state-machine-2
```

## Documentation

### IReadonlyFiniteStateMachine interface
This interface is meant to be used when there is a consumer that merely cares about the state of the machine but not to do anything to affect that state.

It requires two generic inputs - a `StateType` and an `EventType`. Both must simply fit the type `defined`.

#### stateChanged Signal
`readonly stateChanged: IReadOnlySignal<(newState: StateType, oldState: StateType, event: EventType) => void>;`

Fired when the current state is changed by an event.

#### getCurrentState Method
`getCurrentState(): StateType;`

Used to get the current state of the machine.

### FiniteStateMachine class

_Implements everything from `IReadonlyFiniteStateMachine`._

This is the root of this package.

#### Construction
In order to construct a `FiniteStateMachine` instance, you will need to define your states, events, and the transition relationships between them. The transition relationships are represented using a nested tuple of `[[fromState, event], toState]`.

Take this on/off switch as an example:
```ts
type StateType = "On" | "Off";
type EventType = "Toggle";
const stateTransitions = new Map<[StateType, EventType], StateType>([
	[["Off", "Toggle"], "On"],
	[["On", "Toggle"], "Off"]
]);
const fsm = FiniteStateMachine.create("Off", stateTransitions);
```

#### destroy Method
`destroy(): void`

This method is used to destroy an instance. That instance will throw exceptions if any other methods are used after this is invoked.

#### handleEvent Method
`handleEvent(event: EventType): void`

This method is used to effect a state transition though an event. If the given event has a valid state to transition to from the current state as per the state transitions at the time of the instance's construction, the state will be changed accordingly; otherwise, an error will be raised.

Example using the on/off switch from above:
```ts
function toggleSwitch() {
	fsm.handleEvent("Toggle");
}
```
