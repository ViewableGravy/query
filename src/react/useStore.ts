/* eslint-disable @typescript-eslint/no-explicit-any */

import { Store } from "../core/store"
import { shallow } from "../utilities/shallow";
// import { useSyncExternalStoreWithSelector } from "./naiveUseSyncExternalStoreWithSelector";
import { useSyncExternalStoreWithSelector } from "./useSyncExternalStoreWithSelector";

type Selector<TData, TSelected> = (data: TData) => TSelected
type UseStore = <TData, TSelected = TData>(
    store: Store<TData>,
    selector?: Selector<NoInfer<TData>, TSelected>
) => TSelected;

export const useStore: UseStore = (store, selector = (d: any) => d) => {
    const selected = useSyncExternalStoreWithSelector(
        store.subscribe,
        () => store.state,
        selector,
        shallow
    )

    return selected;
}