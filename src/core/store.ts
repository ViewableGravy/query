type Updater<T = any> = (value: T) => T
type Unsubscribe = () => void;
type Listener<TData> = (data: TData) => void;
type Subscribe<TData> = (listener: Listener<TData>) => Unsubscribe;
type SetState<TData> = (state: Updater<TData>) => void

export class Store<TData> {
    public listeners = new Set<Listener<TData>>
    public state: TData;

    constructor(defaultValues: TData) {
        this.state = defaultValues;
    }

    public subscribe: Subscribe<TData> = (callback) => {
        this.listeners.add(callback);

        return () => this.listeners.delete(callback);
    }

    public setState: SetState<TData> = (updater: Updater<TData>) => {
        const newState = updater(this.state);

        // update store
        this.state = newState;

        // notify listeners
        this.listeners.forEach((listener) => listener(newState))
    }
}
