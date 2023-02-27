export type Subscriber<T> = (value: T) => void;

export abstract class ReactiveState<T> {
  protected value: T;
  private subscribers: Subscriber<T>[];

  constructor(initialValue: T) {
    this.value = initialValue;
    this.subscribers = [];
  }

  public dispose(): void {}

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    this.value = newValue;
    this.notify();
  }

  subscribe(subscriber: Subscriber<T>): Subscriber<T> {
    if (this.subscribers.indexOf(subscriber) === -1) {
      this.subscribers.push(subscriber);
      subscriber(this.value);
      return subscriber;
    }
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    const index = this.subscribers.indexOf(subscriber);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  protected notify(): void {
    for (const subscriber of this.subscribers) {
      subscriber(this.value);
    }
  }
}
