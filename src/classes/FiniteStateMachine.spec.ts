/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/// <reference types="@rbxts/testez/globals" />

import fitumi from "@rbxts/fitumi";
import { a } from "@rbxts/fitumi";
import { SignalFactory } from "factories/SignalFactory";
import { FiniteStateMachine, TransitionData, GuardType } from "./FiniteStateMachine";

type StateType = "A" | "B" | "C";
type EventType = "A-B" | "A-C" | "B-C" | "C-A" | "Loop";

type AData = {
	foo: string;
};

type BData = {
	bar: number;
};

type CData = {
	baz: boolean;
};

type Data = AData | BData | CData;

const ALL_STATES: ReadonlyArray<StateType> = ["A", "B", "C"];

const DEFAULT_STATE_TRANSITIONS: ReadonlyMap<[StateType, EventType], TransitionData<StateType, Data>> = new Map<
	[StateType, EventType],
	TransitionData<StateType, Data>
>([
	[["A", "A-B"], { state: "B", guard: (data: AData) => data.foo === "foo" }],
	[["A", "A-C"], { state: "C", guard: (data: AData) => data.foo === "foo" }],
	[["A", "Loop"], { state: "A", guard: (data: AData) => data.foo === "foo" }],
	[["B", "B-C"], { state: "C", guard: (data: BData) => data.bar === 42 }],
	[["B", "Loop"], { state: "B", guard: (data: BData) => data.bar === 42 }],
	[["C", "C-A"], { state: "A", guard: (data: CData) => data.baz === true }],
	[["C", "Loop"], { state: "C", guard: (data: CData) => data.baz === true }],
]);

class UnitTestableFiniteStateMachine extends FiniteStateMachine<StateType, EventType, Data> {
	public constructor(
		args?: Partial<{
			currentState: StateType;
			signalFactory: SignalFactory;
			tupleKeyStateTransitions: ReadonlyMap<[StateType, EventType], TransitionData<StateType, Data>>;
		}>,
	) {
		super(
			args?.currentState ?? "A",
			args?.signalFactory ?? new SignalFactory(),
			args?.tupleKeyStateTransitions ?? DEFAULT_STATE_TRANSITIONS,
			new Map([
				["A", { foo: "foo" }],
				["B", { bar: 42 }],
				["C", { baz: true }],
			]),
		);
	}
}

export = () => {
	describe("initialState", () => {
		it("should reflect whatever it is given at initialization", () => {
			for (const state of ALL_STATES) {
				const fsm = new UnitTestableFiniteStateMachine({
					currentState: state,
				});

				expect(fsm.getCurrentState()).to.equal(state);
			}
		});
	});

	describe("getCurrentState", () => {
		// testing getCurrentState is sort of impossible to do alone
		// and if it isn't working, then all the other tests are going to fail anyway
	});

	describe("handleEvent", () => {
		it("should properly update state and fire stateChanged when given an event with a valid transition from the current state", () => {
			for (const [[startState, event], newState] of DEFAULT_STATE_TRANSITIONS) {
				const fsm = new UnitTestableFiniteStateMachine({
					currentState: startState,
				});

				expect(fsm.getCurrentState()).to.equal(startState);

				let eventArgsTuple: [StateType, StateType, EventType] | undefined = undefined;
				fsm.stateChanged.Connect((newState, oldState, event) => {
					expect(eventArgsTuple).never.to.be.ok();

					eventArgsTuple = [newState, oldState, event];
				});

				fsm.handleEvent(event);

				expect(fsm.getCurrentState()).to.equal(newState);
				expect(eventArgsTuple).to.be.ok();
				expect(eventArgsTuple![0]).to.equal(newState);
				expect(eventArgsTuple![1]).to.equal(startState);
				expect(eventArgsTuple![2]).to.equal(event);
			}
		});

		it("should throw when given an invalid event for the current state", () => {
			const fsm = new UnitTestableFiniteStateMachine({
				currentState: "B",
			});

			expect(() => fsm.handleEvent("A-C")).to.throw();
		});
	});
};
