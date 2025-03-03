import { IReadOnlySignal } from "@rbxts/signals-tooling";

export interface IReadonlyFiniteStateMachine<
	StateType extends defined,
	EventType extends defined,
	Data extends defined,
> {
	/** Fired when the current state is changed by an event */
	readonly stateChanged: IReadOnlySignal<(newState: StateType, oldState: StateType, event: EventType) => void>;

	/** Gets the current state */
	getCurrentState(): StateType;

	/** Gets the current state data */
	getCurrentStateData(): Data;
}
