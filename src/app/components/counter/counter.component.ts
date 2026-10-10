import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
} from '@ionic/angular';
import { SavedCounter } from '../../models/saved-counter';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonInput,
  ],
})
export class CounterComponent {
  readonly heading = input('Nové počítadlo');
  readonly saved = output<SavedCounter>();

  counterName = '';
  startingValue = 0;
  count = 0;

  setStartingValue(value: number | string | null): void {
    const parsedValue = Number(value);
    this.startingValue = Number.isFinite(parsedValue)
      ? Math.max(0, Math.trunc(parsedValue))
      : 0;
    this.count = this.startingValue;
  }

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  reset(): void {
    this.count = this.startingValue;
  }

  save(): void {
    const name = this.counterName.trim();

    if (!name) {
      return;
    }

    this.saved.emit({
      id: crypto.randomUUID(),
      name,
      value: this.count,
      createdAt: new Date().toISOString(),
    });

    this.counterName = '';
  }
}