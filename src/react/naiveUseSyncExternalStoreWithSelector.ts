/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

type OnSubscribe = () => void;
type Unsubscribe = () => void;
type Subscribe = (callback: OnSubscribe) => Unsubscribe;
type UseSyncExternalStoreWithSelector = <TData, TSelected = TData>(
    subscribe: Subscribe,
    getSnapshot: () => TData,
    select: (data: TData) => TSelected,
    isEqual?: (a: TSelected, b: TSelected) => boolean
) => TSelected;

/**
 * Provides a client only version of `useSyncExternalStore` that also accepts a selector function
 */
export const useSyncExternalStoreWithSelector: UseSyncExternalStoreWithSelector = (
    subscribe,
    getSnapshot,
    select,
    isEqual = Object.is
) => {
    /***** STATE *****/
    const [state, setState] = React.useState(select(getSnapshot()));

    /***** EFFECTS *****/
    useEffect(() => {
        const unsubscribe = subscribe(() => {
            const newState = select(getSnapshot());
            if (!isEqual(state, newState)) {
                setState(newState);
            }
        });

        return unsubscribe;
    }, [subscribe, select]);

    /***** HOOK RESULTS *****/
    return state;

}