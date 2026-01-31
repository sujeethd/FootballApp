import { Bell, Check } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import type { Alert } from '@/app/types/sports';
import { format } from 'date-fns';

interface AlertsPanelProps {
  alerts: Alert[];
  onMarkAsRead: (alertId: string) => void;
  onMarkAllAsRead: () => void;
}

export function AlertsPanel({ alerts, onMarkAsRead, onMarkAllAsRead }: AlertsPanelProps) {
  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="font-semibold">Alerts</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onMarkAllAsRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No alerts yet
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-colors ${
                  alert.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm ${!alert.read ? 'font-medium' : ''}`}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(alert.timestamp, 'MMM dd, HH:mm')}
                    </p>
                  </div>
                  {!alert.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(alert.id)}
                      className="ml-2"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
