import { useEffect, useRef, useState, useCallback } from 'react';

export type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface UseWebSocketOptions<TMessage> {
  url: string | null;
  onMessage?: (data: TMessage) => void;
  maxRetries?: number;
  baseReconnectDelayMs?: number;
}

export function useWebSocket<TMessage = unknown, TSend = unknown>(
  options: UseWebSocketOptions<TMessage>
) {
  const {
    url,
    onMessage,
    maxRetries = 5,
    baseReconnectDelayMs = 1000,
  } = options;

  const [status, setStatus] = useState<ConnectionStatus>('closed');
  const [lastMessage, setLastMessage] = useState<TMessage | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUnmountedRef = useRef(false);

  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    isUnmountedRef.current = false;

    if (!url) {
      setStatus('closed');
      return;
    }

    const connect = () => {
      if (isUnmountedRef.current) return;
      setStatus('connecting');

      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        if (isUnmountedRef.current) return;
        retriesRef.current = 0;
        setStatus('open');
      };

      ws.onmessage = (event: MessageEvent) => {
        if (isUnmountedRef.current) return;
        try {
          const parsed = JSON.parse(event.data) as TMessage;
          setLastMessage(parsed);
          onMessageRef.current?.(parsed);
        } catch {
          setLastMessage(event.data as TMessage);
          onMessageRef.current?.(event.data as TMessage);
        }
      };

      ws.onerror = () => {
        if (isUnmountedRef.current) return;
        setStatus('error');
      };

      ws.onclose = () => {
        if (isUnmountedRef.current) return;
        setStatus('closed');

        if (retriesRef.current < maxRetries) {
          const delay = baseReconnectDelayMs * Math.pow(2, retriesRef.current);
          retriesRef.current += 1;
          reconnectTimerRef.current = setTimeout(connect, delay);
        }
      };
    };

    connect();

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      socketRef.current?.close();
    };
  }, [url, maxRetries, baseReconnectDelayMs]);

  const sendJsonMessage = useCallback((payload: TSend): boolean => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }, []);

  return {
    status,
    lastMessage,
    sendJsonMessage,
  };
}
