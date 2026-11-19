import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from './useWebSocket';

class MockWebSocket {
  static OPEN = 1;
  static CLOSED = 3;
  static instances: MockWebSocket[] = [];

  url: string;
  readyState = 0;
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  send = vi.fn();
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSED;
  });

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  simulateOpen() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.();
  }

  simulateMessage(data: unknown) {
    this.onmessage?.({ data: JSON.stringify(data) } as MessageEvent);
  }

  simulateClose() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }
}

describe('09-realtime-websockets : Connexion Temps Réel & Reconnexion Auto', () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('doit ouvrir la connexion, recevoir des messages JSON et permettre l’envoi', () => {
    const onMessage = vi.fn();
    const { result } = renderHook(() =>
      useWebSocket<{ type: string; text: string }>({
        url: 'ws://localhost:8080/ws',
        onMessage,
      })
    );

    expect(result.current.status).toBe('connecting');
    const ws = MockWebSocket.instances.at(0)!;

    act(() => {
      ws.simulateOpen();
    });
    expect(result.current.status).toBe('open');

    act(() => {
      ws.simulateMessage({ type: 'CHAT', text: 'Bonjour équipe !' });
    });
    expect(result.current.lastMessage).toEqual({
      type: 'CHAT',
      text: 'Bonjour équipe !',
    });
    expect(onMessage).toHaveBeenCalledTimes(1);

    const sent = result.current.sendJsonMessage({ ping: true });
    expect(sent).toBe(true);
    expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ ping: true }));
  });

  it('doit tenter une reconnexion automatique après une coupure inattendue', () => {
    renderHook(() =>
      useWebSocket({
        url: 'ws://localhost:8080/ws',
        maxRetries: 3,
        baseReconnectDelayMs: 500,
      })
    );

    expect(MockWebSocket.instances).toHaveLength(1);
    const firstSocket = MockWebSocket.instances.at(0)!;

    act(() => {
      firstSocket.simulateOpen();
      firstSocket.simulateClose();
    });

    // Après 500ms, une deuxième instance WebSocket doit être créée automatiquement
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(MockWebSocket.instances).toHaveLength(2);
  });
});
