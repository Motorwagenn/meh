import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  const counterService = {
    add: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    counterService.add.mockClear();
    TestBed.configureTestingModule({
      providers: [{ provide: CounterService, useValue: counterService }],
    });
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save the single counter through CounterService', async () => {
    const counter: SavedCounter = {
      id: 'counter',
      name: 'Počítadlo',
      value: 1,
      createdAt: '2026-09-17T08:00:00.000Z',
    };

    await component.onSaved(counter);

    expect(counterService.add).toHaveBeenCalledExactlyOnceWith(counter);
  });
});