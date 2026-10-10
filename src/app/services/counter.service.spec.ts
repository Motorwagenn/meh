import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from './counter.service';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('CounterService', () => {
  let service: CounterService;

  const getMock = vi.mocked(Preferences.get);
  const setMock = vi.mocked(Preferences.set);
  const removeMock = vi.mocked(Preferences.remove);

  const first: SavedCounter = {
    id: 'first',
    name: 'První',
    value: 1,
    createdAt: '2026-09-17T08:00:00.000Z',
  };

  const second: SavedCounter = {
    id: 'second',
    name: 'Druhé',
    value: 2,
    createdAt: '2026-09-17T09:00:00.000Z',
  };

  beforeEach(() => {
    // Vynulujeme počty volání mocků z předchozího testu.
    vi.clearAllMocks();

    // Výchozí stav: v Preferences zatím není uložená historie.
    getMock.mockResolvedValue({ value: null });

    // Zápis i odstranění ve výchozím stavu úspěšně skončí.
    setMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);

    // Pro každý test vytvoříme nové prostředí Angular dependency injection.
    TestBed.configureTestingModule({
      providers: [CounterService],
    });

    // Z testovacího injectoru získáme čerstvou instanci služby.
    service = TestBed.inject(CounterService);
  });

  it('should initialize only once', async () => {
    // Dvě volání bez čekání simulují souběžné požadavky na inicializaci.
    await Promise.all([service.initialize(), service.initialize()]);

    // Další volání proběhne až po dokončení první inicializace.
    await service.initialize();

    // Všechna volání musí sdílet jedinou operaci načtení Preferences.
    expect(getMock).toHaveBeenCalledTimes(1);

    // Služba dokončila inicializaci a při value: null má prázdnou historii.
    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);
  });

  it('should load saved data', async () => {
    // Určíme, co má falešná metoda Preferences.get() vrátit.
    getMock.mockResolvedValue({
      // Preferences ukládají pouze řetězce, proto pole převedeme na JSON.
      value: JSON.stringify([first, second]),
    });

    // Počkáme, až služba hodnotu načte, převede z JSON a aktualizuje signal.
    await service.initialize();

    // Signal musí po inicializaci obsahovat stejné dva objekty.
    expect(service.counters()).toEqual([first, second]);
    expect(service.initialized()).toBe(true);

    // Současně ověříme, že služba četla správný klíč Preferences.
    expect(getMock).toHaveBeenCalledWith({ key: 'saved-counters' });
  });

  it('should add new item with correct key', async () => {
    getMock.mockResolvedValue({
      value: JSON.stringify([second]),
    });

    await service.add(first);

    expect(service.counters()).toEqual([first, second]);
    expect(setMock).toHaveBeenCalledWith({
      key: 'saved-counters',
      value: JSON.stringify([first, second]),
    });
  });

  it('should remove only the matching item and save the new state', async () => {
    getMock.mockResolvedValue({
      value: JSON.stringify([first, second]),
    });

    await service.remove(first.id);

    expect(service.counters()).toEqual([second]);
    expect(setMock).toHaveBeenCalledWith({
      key: 'saved-counters',
      value: JSON.stringify([second]),
    });
  });

  it('should clear history and remove only the saved-counters key', async () => {
    getMock.mockResolvedValue({
      value: JSON.stringify([first, second]),
    });

    await service.clear();

    expect(service.counters()).toEqual([]);
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith({ key: 'saved-counters' });
    expect(setMock).not.toHaveBeenCalled();
  });

  it('should recover from invalid JSON', async () => {
    // 1. Preferences vrátí text, který nelze převést pomocí JSON.parse().
    getMock.mockResolvedValue({
      value: 'this is not a valid JSON',
    });

    // 2. Sledování musíme zapnout ještě před spuštěním initialize().
    // mockImplementation zároveň zabrání vypsání očekávané chyby do testovacího výstupu.
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    // 3. Chyba vznikne a bude zachycena uvnitř této inicializace.
    await service.initialize();

    // 4. Služba nespadla a přešla do bezpečného prázdného stavu.
    expect(service.counters()).toEqual([]);
    expect(service.initialized()).toBe(true);

    // CounterService volá console.error se zprávou a zachyceným objektem Error.
    expect(errorSpy).toHaveBeenCalledWith(
      'Historii počítadel se nepodařilo načíst.',
      expect.any(Error),
    );

    // 5. Vrátíme console.error do původního stavu pro ostatní testy.
    errorSpy.mockRestore();

  });

  it('should recover from invalid JSON', async () => {
    // 1. Preferences vrátí text, který nelze převést pomocí JSON.parse().
    getMock.mockResolvedValue({
      value: JSON.stringify({ name: 'test' }),
    });
    
    // 2. Sledování musíme zapnout ještě před spuštěním initialize().
    // mockImplementation zároveň zabrání vypsání očekávané chyby do testovacího výstupu.
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    // 3. Chyba vznikne a bude zachycena uvnitř této inicializace.
    await service.initialize();

    // 4. Služba nespadla a přešla do bezpečného prázdného stavu.
    expect(service.counters()).toEqual([]);
    expect(service.initialized()).toBe(true);

    // CounterService volá console.error se zprávou a zachyceným objektem Error.
    expect(errorSpy).toHaveBeenCalledWith(
      'Historii počítadel se nepodařilo načíst.',
      expect.any(Error),
    );

    // 5. Vrátíme console.error do původního stavu pro ostatní testy.
    errorSpy.mockRestore();

  });

});