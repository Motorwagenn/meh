import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SavedCounter } from '../../models/saved-counter';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set a non-negative whole-number default and initialize the count', () => {
    component.setStartingValue('4.8');
    expect(component.startingValue).toBe(4);
    expect(component.count).toBe(4);

    component.setStartingValue(-3);
    expect(component.startingValue).toBe(0);
    expect(component.count).toBe(0);

    component.setStartingValue(null);
    expect(component.startingValue).toBe(0);
    expect(component.count).toBe(0);
  });

  it('should keep the starting value independent from count changes', () => {
    component.setStartingValue(5);

    component.increment();

    expect(component.startingValue).toBe(5);
    expect(component.count).toBe(6);
  });

  it('should decrement but never go below zero', () => {
    component.decrement();
    expect(component.count).toBe(0);

    component.count = 2;
    component.decrement();
    expect(component.count).toBe(1);
  });

  it('should reset the counter to its starting value', () => {
    component.setStartingValue(3);
    component.count = 5;

    component.reset();

    expect(component.count).toBe(3);
  });

  it('should not save without a name', () => {
    const emitted: SavedCounter[] = [];
    component.saved.subscribe((counter) => emitted.push(counter));
    component.counterName = '   ';
    component.count = 3;

    component.save();

    expect(emitted).toEqual([]);
  });

  it('should emit the live count and keep both values after saving', () => {
    const emitted: SavedCounter[] = [];
    component.saved.subscribe((counter) => emitted.push(counter));
    component.counterName = ' Návštěvníci ';
    component.setStartingValue(3);
    component.increment();

    component.save();

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toMatchObject({
      name: 'Návštěvníci',
      value: 4,
    });
    expect(emitted[0].id).toEqual(expect.any(String));
    expect(component.counterName).toBe('');
    expect(component.startingValue).toBe(3);
    expect(component.count).toBe(4);
  });
});