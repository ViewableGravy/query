import React from "react";

/***** TYPE DEFINITIONS *****/
type OnSubscribe = () => void;
type Unsubscribe = () => void;
type Subscribe = (callback: OnSubscribe) => Unsubscribe;
type Select<TData, TSelected> = (data: TData) => TSelected;

/***** CONSTS ******/
const uninitialized = Symbol("uninitialized");
type Uninitialized = typeof uninitialized;

/***** COMPONENT START *****/
export const useSyncExternalStoreWithSelector = <TData, TSelected = TData>(
    subscribe: Subscribe,
    getSnapshot: () => TData,
    select: Select<TData, TSelected>,
    isEqual = Object.is
) => {
    const lastSelectedRef = React.useRef<TSelected | Uninitialized>(uninitialized);

    /***** SELECTOR FUNCTION *****/
    const getSelectedSnapshot = () => {
        const snapshot = getSnapshot();
        const selected = select(snapshot);
        const _isEqual = isEqual(lastSelectedRef.current, selected);
        const _isSelectedSet = lastSelectedRef.current !== uninitialized;
        if (!_isEqual || !_isSelectedSet) {
            lastSelectedRef.current = selected;
        }

        // if it was Uninitialized above, we have set it to the selected value which cannot be
        // unitialized (since the symbol is not exported)
        return lastSelectedRef.current as TSelected;
    }

    /***** HOOK RESULTS *****/
    return React.useSyncExternalStore(
        subscribe,
        getSelectedSnapshot, // CSR
        getSelectedSnapshot // SSR
    )
}