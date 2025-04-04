"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, Home, Zap } from "lucide-react"

interface Activity {
  id: string
  type: string
  time: string
  duration: number
  carbonAmount: number
}

export function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([
    
  ])

  const [newActivity, setNewActivity] = useState({
    type: "",
    time: "",
    duration: "",
  })

  const getIcon = (type: string) => {
    return <Zap className="h-5 w-5 text-white" />
  }

  const getLabel = (type: string) => {
    return type
  }

  const handleAddActivity = () => {
    if (!newActivity.time || !newActivity.duration) return

    // Calculate carbon based on type and duration (simplified)
    let carbonAmount = 0

     carbonAmount = Number(newActivity.duration) * 0.27

    const newActivityItem: Activity = {
      id: Date.now().toString(),
      type: newActivity.type as string,
      time: newActivity.time,
      duration: Number(newActivity.duration),
      carbonAmount: Number(carbonAmount.toFixed(2)),
    }

    setActivities([...activities, newActivityItem])
    setNewActivity({
      type: "",
      time: "",
      duration: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-background/80 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Recent Usage</h3>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3">
                  {getIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium">{getLabel(activity.type)}</p>
                  <p className="text-sm text-muted-foreground">
                    At {activity.time} for {activity.duration} minutes
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{activity.carbonAmount} kg</p>
                <Button variant="link" className="text-primary p-0 h-auto">
                  edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background/80 rounded-lg p-4">
        <div className="space-y-3">
          <Input
            placeholder="Use...."
            value={newActivity.type}
            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Time..."
            type="time"
            value={newActivity.time}
            onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Duration..."
            type="number"
            value={newActivity.duration}
            onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
            className="mb-2"
          />
          <Button onClick={handleAddActivity} className="w-full" variant="outline">
            ADD
          </Button>
        </div>
      </div>
    </div>
  )
}

