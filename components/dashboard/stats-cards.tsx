import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalLeads: number
    newLeads: number
    qualifiedLeads: number
    closedLeads: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      description: "All leads in system",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      description: "Leads requiring attention",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Qualified",
      value: stats.qualifiedLeads,
      description: "Ready for proposals",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Closed",
      value: stats.closedLeads,
      description: "Successfully closed",
      icon: CheckCircle,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
