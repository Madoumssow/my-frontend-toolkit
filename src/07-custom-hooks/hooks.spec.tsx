import React, { useRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, render, fireEvent } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';
import { useClickOutside } from './useClickOutside';

describe('07-custom-hooks : Hooks utilitaires de production', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it('useDebounce : ne doit mettre à jour la valeur qu’après le délai imparti', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ text }) => useDebounce(text, 400),
      { initialProps: { text: 'react' } }
    );

    expect(result.current).toBe('react');

    rerender({ text: 'react typescript' });
    // Avant les 400ms, la valeur reste l'ancienne
    expect(result.current).toBe('react');

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe('react typescript');
  });

  it('useLocalStorage : doit lire, persister et supprimer une valeur JSON typée', () => {
    const { result } = renderHook(() =>
      useLocalStorage('app_theme', { dark: false })
    );

    expect(result.current.at(0)).toEqual({ dark: false });

    act(() => {
    const setValue = result.current.at(1) as (val :{ dark: true }) => void;
        setValue({ dark: true });
    });
    expect(result.current.at(0)).toEqual({ dark: true });
    expect(JSON.parse(window.localStorage.getItem('app_theme')!)).toEqual({
        dark: true,
    });

    act(() => {
    const removeValue = result.current.at(2) as () => void;
        removeValue();
    });
    expect(result.current.at(0)).toEqual({ dark: false });
    expect(window.localStorage.getItem('app_theme')).toBeNull();
  });

  it('useClickOutside : doit déclencher le handler uniquement lors d’un clic externe', () => {
    const onOutsideClick = vi.fn();

    const DropdownTest = () => {
      const boxRef = useRef<HTMLDivElement>(null);
      useClickOutside(boxRef, onOutsideClick);
      return (
        <div>
          <div ref={boxRef} data-testid="inside">
            Menu Interne
          </div>
          <div data-testid="outside">Zone Externe</div>
        </div>
      );
    };

    const { getByTestId } = render(<DropdownTest />);

    fireEvent.mouseDown(getByTestId('inside'));
    expect(onOutsideClick).not.toHaveBeenCalled();

    fireEvent.mouseDown(getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });
});
