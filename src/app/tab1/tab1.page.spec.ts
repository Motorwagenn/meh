import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep saved counters independent between the two counters', () => {
    const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
    };
    const other: SavedCounter = {
      id: 'other',
      name: 'Jiné',
      value: 2,
    };

    component.onLeftSaved(first);
    component.onRightSaved(other);

    expect(component.leftCounters).toEqual([first]);
    expect(component.rightCounters).toEqual([other]);
  });

  it('should delete a counter only from its own saved list', () => {
    const first: SavedCounter = { id: 'first', name: 'První', value: 1 };
    const second: SavedCounter = { id: 'second', name: 'Druhé', value: 2 };
    component.leftCounters = [first, second];
    component.rightCounters = [first];

    component.deleteLeftCounter('first');

    expect(component.leftCounters).toEqual([second]);
    expect(component.rightCounters).toEqual([first]);
  });
});