/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

type OnSubscribe = () => void;
type Unsubscribe = () => void;
type Subscribe = (callback: OnSubscribe) => Unsubscribe;
type Select<TData, TSelected> = (data: TData) => TSelected;

export const useSyncExternalStoreWithSelector = <TData, TSelected = TData>(
    subscribe: Subscribe,
    getSnapshot: () => TData,
    select: Select<TData, TSelected>,
    isEqual = Object.is
) => {
    const lastSelectedRef = React.useRef<TSelected>(undefined);
    const lastSnapshotRef = React.useRef<TData>(undefined);

    /***** SELECTOR FUNCTION *****/
    const getSelectedSnapshot = () => {
        const snapshot = getSnapshot();
        const selected = select(snapshot);
        const _isEqual = isEqual(lastSelectedRef.current, selected);
        const _isSelectedSet = lastSelectedRef.current !== undefined;
        if (!_isEqual || !_isSelectedSet) {
            lastSnapshotRef.current = snapshot;
            lastSelectedRef.current = selected;
        }

        // must be defined since we are defining it ALWAYS in the above condition
        return lastSelectedRef.current as TSelected;
    }

    /***** HOOK RESULTS *****/
    return React.useSyncExternalStore(
        subscribe,
        getSelectedSnapshot, // CSR
        getSelectedSnapshot // SSR
    )
}