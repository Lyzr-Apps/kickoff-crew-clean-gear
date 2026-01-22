import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Plus, X, ChevronRight, Download, Copy, RefreshCw,
  FileText, CheckCircle, AlertCircle, Clock, TrendingUp,
  Users, Target, Calendar, Loader2, ArrowLeft, ExternalLink,
  Sparkles, BarChart, Layers, Mail, Check
} from 'lucide-react'
import { callAIAgent } from '@/utils/aiAgent'
import type { NormalizedAgentResponse } from '@/utils/aiAgent'
import { cn } from '@/lib/utils'

// Agent ID from orchestrator
const ORCHESTRATOR_AGENT_ID = "6972876bd6d0dcaec111dce4"

// TypeScript interfaces based on ACTUAL test response data
interface UserPersona {
  name: string
  description: string
  pain_points: string[]
  goals: string[]
}

interface Feature {
  name: string
  description: string
  user_value: string
}

interface SuccessMetric {
  metric: string
  target: string
  measurement_method: string
}

interface Scope {
  in_scope: string[]
  out_of_scope: string[]
}

interface PRDResult {
  problem_statement: string
  user_personas: UserPersona[]
  features: Feature[]
  success_metrics: SuccessMetric[]
  scope: Scope
  summary: string
}

interface PrioritizedFeature {
  feature_name: string
  rice_score: number
  reach: number
  impact: number
  confidence: number
  effort: number
  priority: string
  rationale: string
}

interface RoadmapRecommendation {
  phase_1: string[]
  phase_2: string[]
  phase_3: string[]
}

interface CompetitorAnalysis {
  competitor_name: string
  strengths: string[]
  weaknesses: string[]
  market_position: string
}

interface MarketInsights {
  market_size: string
  trends: string[]
  opportunities: string[]
}

interface PrioritizerResult {
  competitor_analysis: CompetitorAnalysis[]
  market_insights: MarketInsights
  prioritized_features: PrioritizedFeature[]
  roadmap_recommendation: RoadmapRecommendation
  summary: string
}

interface UserStory {
  story_id: string
  epic: string
  title: string
  user_story: string
  acceptance_criteria: string[]
  story_points: number
  priority: string
  sprint_recommendation: string
}

interface Epic {
  epic_name: string
  epic_description: string
  business_value: string
}

interface SprintInfo {
  stories: string[]
  total_points: number
  focus: string
}

interface SprintPlan {
  sprint_1: SprintInfo
  sprint_2: SprintInfo
}

interface StoryMapperResult {
  epics: Epic[]
  user_stories: UserStory[]
  sprint_plan: SprintPlan
  summary: string
}

interface WorkspaceLinks {
  prd_url: string
  roadmap_url: string
  user_stories_url: string
}

interface NotificationsSent {
  stakeholders_notified: string[]
  email_subject: string
  sent_at: string
}

interface ProductOpsResult {
  package_created: boolean
  workspace_links: WorkspaceLinks
  notifications_sent: NotificationsSent
  summary: string
}

interface PRDOutput {
  problem_statement: string
  features_count: number
  personas_count: number
  status: string
}

interface PrioritizationOutput {
  top_features: string[]
  competitors_analyzed: number
  status: string
}

interface StoryMappingOutput {
  total_stories: number
  total_epics: number
  sprint_count: number
  status: string
}

interface DeliveryOutput {
  notion_url: string
  notifications_sent: number
  status: string
}

interface OrchestratorResult {
  workflow_status: string
  prd_output: PRDOutput
  prioritization_output: PrioritizationOutput
  story_mapping_output: StoryMappingOutput
  delivery_output: DeliveryOutput
  executive_summary: string
  next_actions: string[]
}

interface KickoffProject {
  id: string
  title: string
  date: string
  status: 'completed' | 'in_progress' | 'draft'
  features_count: number
}

// Sub-components defined OUTSIDE of Home() to prevent re-creation
function DashboardView({ onNewKickoff, projects }: { onNewKickoff: () => void, projects: KickoffProject[] }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">Recent Kickoffs</CardTitle>
            <CardDescription className="text-slate-400">Your latest product kickoff packages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">No kickoffs yet. Start your first one!</p>
                <Button onClick={onNewKickoff} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Kickoff
                </Button>
              </div>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="border-slate-600 bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-base mb-1">{project.title}</CardTitle>
                        <CardDescription className="text-slate-400 text-sm">{project.date}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={project.status === 'completed' ? 'default' : project.status === 'in_progress' ? 'secondary' : 'outline'}
                          className={cn(
                            project.status === 'completed' && 'bg-green-600 text-white',
                            project.status === 'in_progress' && 'bg-yellow-600 text-white',
                            project.status === 'draft' && 'bg-slate-600 text-white'
                          )}
                        >
                          {project.status === 'completed' ? 'Completed' : project.status === 'in_progress' ? 'In Progress' : 'Draft'}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm text-slate-400">
                      {project.features_count} features prioritized
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-white">{projects.length}</div>
              <div className="text-sm text-slate-400">Total Kickoffs</div>
            </div>
            <Separator className="bg-slate-700" />
            <div>
              <div className="text-2xl font-bold text-white">~60min</div>
              <div className="text-sm text-slate-400">Avg Time Saved</div>
            </div>
            <Separator className="bg-slate-700" />
            <div>
              <div className="text-2xl font-bold text-white">{projects.reduce((acc, p) => acc + p.features_count, 0)}</div>
              <div className="text-sm text-slate-400">Documents Generated</div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={onNewKickoff} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12">
          <Plus className="w-5 h-5 mr-2" />
          New Kickoff
        </Button>
      </div>
    </div>
  )
}

function ProgressStepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { name: 'PRD Builder', icon: FileText },
    { name: 'Prioritizer', icon: TrendingUp },
    { name: 'Story Mapper', icon: Layers },
    { name: 'Product Ops', icon: CheckCircle }
  ]

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const StepIcon = step.icon
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isPending = index > currentStep

        return (
          <div key={step.name} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
                isCompleted && "bg-green-600 text-white",
                isCurrent && "bg-indigo-600 text-white animate-pulse",
                isPending && "bg-slate-700 text-slate-400"
              )}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>
              <div className={cn(
                "text-xs font-medium text-center",
                (isCompleted || isCurrent) && "text-white",
                isPending && "text-slate-500"
              )}>
                {step.name}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 transition-all",
                isCompleted && "bg-green-600",
                !isCompleted && "bg-slate-700"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function GeneratorView({
  onGenerate,
  loading,
  currentStep
}: {
  onGenerate: (formData: FormData) => void
  loading: boolean
  currentStep: number
}) {
  const [productIdea, setProductIdea] = useState('')
  const [workspace, setWorkspace] = useState('notion')
  const [stakeholderEmails, setStakeholderEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleAddEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      setStakeholderEmails(prev => [...prev, emailInput])
      setEmailInput('')
    }
  }

  const handleRemoveEmail = (email: string) => {
    setStakeholderEmails(prev => prev.filter(e => e !== email))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate({
      productIdea,
      workspace,
      stakeholderEmails
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Product Kickoff Generator</CardTitle>
          <CardDescription className="text-slate-400">
            Generate a complete PRD, prioritized roadmap, and user stories for your product idea
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && <ProgressStepper currentStep={currentStep} />}

          <div className="space-y-2">
            <Label htmlFor="productIdea" className="text-white">Product Idea</Label>
            <Textarea
              id="productIdea"
              placeholder="Describe your product idea, target users, and key problems you're solving..."
              value={productIdea}
              onChange={(e) => setProductIdea(e.target.value)}
              className="min-h-[200px] bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 resize-y"
              required
              disabled={loading}
            />
            <div className="text-sm text-slate-400 text-right">
              {productIdea.length} characters
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace" className="text-white">Workspace</Label>
            <Select value={workspace} onValueChange={setWorkspace} disabled={loading}>
              <SelectTrigger id="workspace" className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="notion" className="text-white">Notion</SelectItem>
                <SelectItem value="google_docs" className="text-white">Google Docs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stakeholderEmails" className="text-white">Stakeholder Emails (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="stakeholderEmails"
                type="email"
                placeholder="email@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                disabled={loading}
              />
              <Button
                type="button"
                onClick={handleAddEmail}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {stakeholderEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {stakeholderEmails.map((email) => (
                  <Badge
                    key={email}
                    variant="secondary"
                    className="bg-indigo-600 text-white pr-1 cursor-pointer hover:bg-indigo-700"
                    onClick={() => handleRemoveEmail(email)}
                  >
                    {email}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-indigo-400 hover:text-indigo-300 hover:bg-slate-700/50 p-0 h-auto"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>
            {showAdvanced && (
              <Card className="border-slate-600 bg-slate-700/30 mt-3">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-sm text-slate-400">
                    Advanced features like custom RICE weights and story point scales will be available in future updates.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 bg-slate-700/30 border-t border-slate-700">
          <Button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-12"
            disabled={loading || !productIdea.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Kickoff Package
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700"
            disabled={loading}
          >
            Save Draft
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

function ResultsView({
  orchestratorData,
  prdData,
  prioritizerData,
  storyMapperData,
  productOpsData,
  onStartNew
}: {
  orchestratorData: OrchestratorResult | null
  prdData: PRDResult | null
  prioritizerData: PrioritizerResult | null
  storyMapperData: StoryMapperResult | null
  productOpsData: ProductOpsResult | null
  onStartNew: () => void
}) {
  const handleDownloadPDF = () => {
    alert('PDF download functionality coming soon!')
  }

  const handleCopyAll = () => {
    alert('Copy all functionality coming soon!')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Kickoff Results</h1>
          <p className="text-slate-400">Your complete product kickoff package is ready</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyAll}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </Button>
          <Button
            onClick={onStartNew}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New
          </Button>
        </div>
      </div>

      {orchestratorData && (
        <Card className="border-slate-700 bg-slate-800/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 leading-relaxed">{orchestratorData.executive_summary}</p>

            <div className="grid md:grid-cols-4 gap-4 pt-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">{orchestratorData.prd_output.features_count}</div>
                <div className="text-sm text-slate-400">Features Defined</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">{orchestratorData.prioritization_output.top_features.length}</div>
                <div className="text-sm text-slate-400">Top Priority</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">{orchestratorData.story_mapping_output.total_stories}</div>
                <div className="text-sm text-slate-400">User Stories</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">{orchestratorData.story_mapping_output.sprint_count}</div>
                <div className="text-sm text-slate-400">Sprints Planned</div>
              </div>
            </div>

            {orchestratorData.next_actions.length > 0 && (
              <div className="pt-4">
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Next Actions
                </h4>
                <ul className="space-y-2">
                  {orchestratorData.next_actions.map((action, index) => (
                    <li key={index} className="flex items-start text-slate-300">
                      <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-indigo-400 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="prd" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700 w-full justify-start">
          <TabsTrigger value="prd" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            PRD
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Prioritized Roadmap
          </TabsTrigger>
          <TabsTrigger value="stories" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            User Stories
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Export Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prd">
          {prdData ? (
            <ScrollArea className="h-[600px]">
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Product Requirements Document</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-indigo-400" />
                      Problem Statement
                    </h3>
                    <p className="text-slate-300 leading-relaxed">{prdData.problem_statement}</p>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-indigo-400" />
                      User Personas ({prdData.user_personas.length})
                    </h3>
                    <div className="space-y-4">
                      {prdData.user_personas.map((persona, index) => (
                        <Card key={index} className="border-slate-600 bg-slate-700/30">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">{persona.name}</CardTitle>
                            <CardDescription className="text-slate-400">{persona.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <div className="text-sm font-semibold text-white mb-2">Pain Points:</div>
                              <ul className="space-y-1">
                                {persona.pain_points.map((point, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white mb-2">Goals:</div>
                              <ul className="space-y-1">
                                {persona.goals.map((goal, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex items-start">
                                    <span className="text-green-400 mr-2">•</span>
                                    {goal}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-indigo-400" />
                      Features ({prdData.features.length})
                    </h3>
                    <div className="space-y-3">
                      {prdData.features.map((feature, index) => (
                        <Card key={index} className="border-slate-600 bg-slate-700/30">
                          <CardHeader>
                            <CardTitle className="text-white text-base">{feature.name}</CardTitle>
                            <CardDescription className="text-slate-400">{feature.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-slate-300">
                              <span className="font-semibold text-indigo-400">User Value:</span> {feature.user_value}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <BarChart className="w-5 h-5 mr-2 text-indigo-400" />
                      Success Metrics
                    </h3>
                    <div className="space-y-3">
                      {prdData.success_metrics.map((metric, index) => (
                        <Card key={index} className="border-slate-600 bg-slate-700/30">
                          <CardContent className="pt-4">
                            <div className="font-semibold text-white mb-1">{metric.metric}</div>
                            <div className="text-sm text-slate-300 mb-2">Target: {metric.target}</div>
                            <div className="text-sm text-slate-400">Measured via: {metric.measurement_method}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Scope</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-slate-600 bg-slate-700/30">
                        <CardHeader>
                          <CardTitle className="text-white text-base text-green-400">In Scope</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {prdData.scope.in_scope.map((item, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start">
                                <Check className="w-4 h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border-slate-600 bg-slate-700/30">
                        <CardHeader>
                          <CardTitle className="text-white text-base text-red-400">Out of Scope</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {prdData.scope.out_of_scope.map((item, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start">
                                <X className="w-4 h-4 mr-2 mt-0.5 text-red-400 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {prdData.summary && (
                    <>
                      <Separator className="bg-slate-700" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Summary</h3>
                        <p className="text-slate-300 leading-relaxed">{prdData.summary}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </ScrollArea>
          ) : (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No PRD data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roadmap">
          {prioritizerData ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Prioritized Features</CardTitle>
                    <CardDescription className="text-slate-400">
                      Features ranked by RICE score (Reach × Impact × Confidence / Effort)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-white">Feature</TableHead>
                          <TableHead className="text-white text-center">RICE Score</TableHead>
                          <TableHead className="text-white text-center">Priority</TableHead>
                          <TableHead className="text-white text-center">Reach</TableHead>
                          <TableHead className="text-white text-center">Impact</TableHead>
                          <TableHead className="text-white text-center">Confidence</TableHead>
                          <TableHead className="text-white text-center">Effort</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prioritizerData.prioritized_features.map((feature, index) => (
                          <TableRow key={index} className="border-slate-700">
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-semibold text-white">{feature.feature_name}</div>
                                <div className="text-sm text-slate-400">{feature.rationale}</div>
                                <Progress
                                  value={feature.rice_score}
                                  max={150}
                                  className="h-1.5"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="text-2xl font-bold text-white">{feature.rice_score}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="default"
                                className={cn(
                                  feature.priority === 'High' && 'bg-green-600',
                                  feature.priority === 'Medium' && 'bg-yellow-600',
                                  feature.priority === 'Low' && 'bg-slate-600'
                                )}
                              >
                                {feature.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center text-white">{feature.reach}</TableCell>
                            <TableCell className="text-center text-white">{feature.impact}</TableCell>
                            <TableCell className="text-center text-white">{(feature.confidence * 100).toFixed(0)}%</TableCell>
                            <TableCell className="text-center text-white">{feature.effort}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-white text-base">Phase 1</CardTitle>
                      <CardDescription className="text-slate-400">Foundation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {prioritizerData.roadmap_recommendation.phase_1.map((feature, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start">
                            <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-white text-base">Phase 2</CardTitle>
                      <CardDescription className="text-slate-400">Enhancement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {prioritizerData.roadmap_recommendation.phase_2.map((feature, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start">
                            <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-white text-base">Phase 3</CardTitle>
                      <CardDescription className="text-slate-400">Expansion</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {prioritizerData.roadmap_recommendation.phase_3.map((feature, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start">
                            <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {prioritizerData.competitor_analysis.length > 0 && (
                  <Card className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-white">Competitor Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {prioritizerData.competitor_analysis.map((competitor, index) => (
                        <Card key={index} className="border-slate-600 bg-slate-700/30">
                          <CardHeader>
                            <CardTitle className="text-white text-base">{competitor.competitor_name}</CardTitle>
                            <CardDescription className="text-slate-400">{competitor.market_position}</CardDescription>
                          </CardHeader>
                          <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-semibold text-green-400 mb-2">Strengths</div>
                              <ul className="space-y-1">
                                {competitor.strengths.map((strength, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex items-start">
                                    <span className="text-green-400 mr-2">+</span>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-red-400 mb-2">Weaknesses</div>
                              <ul className="space-y-1">
                                {competitor.weaknesses.map((weakness, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex items-start">
                                    <span className="text-red-400 mr-2">-</span>
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {prioritizerData.market_insights && (
                  <Card className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-white">Market Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold text-white mb-2">Market Size</div>
                        <p className="text-slate-300">{prioritizerData.market_insights.market_size}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-semibold text-white mb-2">Trends</div>
                          <ul className="space-y-1">
                            {prioritizerData.market_insights.trends.map((trend, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start">
                                <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-indigo-400 flex-shrink-0" />
                                {trend}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white mb-2">Opportunities</div>
                          <ul className="space-y-1">
                            {prioritizerData.market_insights.opportunities.map((opportunity, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start">
                                <Target className="w-4 h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          ) : (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="py-12 text-center">
                <BarChart className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No roadmap data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stories">
          {storyMapperData ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Sprint Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <Card className="border-slate-600 bg-slate-700/30">
                      <CardHeader>
                        <CardTitle className="text-white text-base flex items-center justify-between">
                          Sprint 1
                          <Badge variant="secondary" className="bg-indigo-600">
                            {storyMapperData.sprint_plan.sprint_1.total_points} pts
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {storyMapperData.sprint_plan.sprint_1.focus}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {storyMapperData.sprint_plan.sprint_1.stories.map((storyId) => {
                            const story = storyMapperData.user_stories.find(s => s.story_id === storyId)
                            return story ? (
                              <div key={storyId} className="text-sm text-slate-300 flex items-start">
                                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-indigo-400 flex-shrink-0" />
                                <span>{story.title}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-600 bg-slate-700/30">
                      <CardHeader>
                        <CardTitle className="text-white text-base flex items-center justify-between">
                          Sprint 2
                          <Badge variant="secondary" className="bg-indigo-600">
                            {storyMapperData.sprint_plan.sprint_2.total_points} pts
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {storyMapperData.sprint_plan.sprint_2.focus}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {storyMapperData.sprint_plan.sprint_2.stories.map((storyId) => {
                            const story = storyMapperData.user_stories.find(s => s.story_id === storyId)
                            return story ? (
                              <div key={storyId} className="text-sm text-slate-300 flex items-start">
                                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-indigo-400 flex-shrink-0" />
                                <span>{story.title}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">User Stories by Epic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-2">
                      {storyMapperData.epics.map((epic, epicIndex) => {
                        const epicStories = storyMapperData.user_stories.filter(s => s.epic === epic.epic_name)
                        return (
                          <AccordionItem
                            key={epicIndex}
                            value={`epic-${epicIndex}`}
                            className="border border-slate-600 rounded-lg bg-slate-700/30 px-4"
                          >
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-start justify-between w-full pr-4">
                                <div className="text-left">
                                  <div className="font-semibold text-white">{epic.epic_name}</div>
                                  <div className="text-sm text-slate-400 mt-1">{epic.epic_description}</div>
                                </div>
                                <Badge variant="secondary" className="bg-indigo-600 ml-4">
                                  {epicStories.length} stories
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-4">
                              <div className="text-sm text-slate-300 mb-4">
                                <span className="font-semibold text-indigo-400">Business Value:</span> {epic.business_value}
                              </div>
                              {epicStories.map((story, storyIndex) => (
                                <Card key={storyIndex} className="border-slate-600 bg-slate-700/50">
                                  <CardHeader>
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <CardTitle className="text-white text-sm flex items-center gap-2">
                                          <span className="text-slate-400">{story.story_id}</span>
                                          <span>{story.title}</span>
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 mt-2">
                                          {story.user_story}
                                        </CardDescription>
                                      </div>
                                      <div className="flex items-center gap-2 ml-4">
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            "border-slate-600",
                                            story.priority === 'High' && 'bg-green-600/20 text-green-400 border-green-600',
                                            story.priority === 'Medium' && 'bg-yellow-600/20 text-yellow-400 border-yellow-600',
                                            story.priority === 'Low' && 'bg-slate-600/20 text-slate-400 border-slate-600'
                                          )}
                                        >
                                          {story.priority}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-indigo-600">
                                          {story.story_points} pts
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div>
                                      <div className="text-sm font-semibold text-white mb-2">Acceptance Criteria:</div>
                                      <ul className="space-y-1">
                                        {story.acceptance_criteria.map((criteria, i) => (
                                          <li key={i} className="text-sm text-slate-300 flex items-start">
                                            <Check className="w-4 h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                                            {criteria}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                      <Calendar className="w-4 h-4 text-slate-400" />
                                      <span className="text-sm text-slate-400">
                                        Recommended for {story.sprint_recommendation}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          ) : (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="py-12 text-center">
                <Layers className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No user stories available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export">
          {productOpsData ? (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Export & Delivery Status</CardTitle>
                <CardDescription className="text-slate-400">
                  Your kickoff package has been exported to your workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-slate-600 bg-slate-700/30">
                    <CardHeader>
                      <CardTitle className="text-white text-sm flex items-center justify-between">
                        <span>PRD Document</span>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={productOpsData.workspace_links.prd_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                      >
                        View Document
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-600 bg-slate-700/30">
                    <CardHeader>
                      <CardTitle className="text-white text-sm flex items-center justify-between">
                        <span>Roadmap</span>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={productOpsData.workspace_links.roadmap_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                      >
                        View Roadmap
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-600 bg-slate-700/30">
                    <CardHeader>
                      <CardTitle className="text-white text-sm flex items-center justify-between">
                        <span>User Stories</span>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={productOpsData.workspace_links.user_stories_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                      >
                        View Stories
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </CardContent>
                  </Card>
                </div>

                {productOpsData.notifications_sent.stakeholders_notified.length > 0 && (
                  <Card className="border-slate-600 bg-slate-700/30">
                    <CardHeader>
                      <CardTitle className="text-white text-base flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-indigo-400" />
                        Notifications Sent
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-300">
                        <span className="font-semibold">Subject:</span> {productOpsData.notifications_sent.email_subject}
                      </div>
                      <div className="text-sm text-slate-300">
                        <span className="font-semibold">Sent at:</span> {new Date(productOpsData.notifications_sent.sent_at).toLocaleString()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white mb-2">Recipients:</div>
                        <div className="flex flex-wrap gap-2">
                          {productOpsData.notifications_sent.stakeholders_notified.map((email, i) => (
                            <Badge key={i} variant="secondary" className="bg-indigo-600">
                              {email}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-slate-600 bg-slate-700/30">
                  <CardContent className="pt-6">
                    <p className="text-slate-300 leading-relaxed">{productOpsData.summary}</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : orchestratorData?.delivery_output ? (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Export & Delivery Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn(
                  "p-4 rounded-lg border flex items-start gap-3",
                  orchestratorData.delivery_output.status === 'Completed'
                    ? "bg-green-600/10 border-green-600"
                    : "bg-red-600/10 border-red-600"
                )}>
                  {orchestratorData.delivery_output.status === 'Completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-white mb-1">
                      {orchestratorData.delivery_output.status === 'Completed' ? 'Delivery Successful' : 'Delivery Issue'}
                    </div>
                    <div className="text-sm text-slate-300">{orchestratorData.delivery_output.notion_url}</div>
                  </div>
                </div>

                <div className="text-sm text-slate-400">
                  Notifications sent: {orchestratorData.delivery_output.notifications_sent}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No export data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface FormData {
  productIdea: string
  workspace: string
  stakeholderEmails: string[]
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'generator' | 'results'>('dashboard')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Response data states
  const [orchestratorData, setOrchestratorData] = useState<OrchestratorResult | null>(null)
  const [prdData, setPrdData] = useState<PRDResult | null>(null)
  const [prioritizerData, setPrioritizerData] = useState<PrioritizerResult | null>(null)
  const [storyMapperData, setStoryMapperData] = useState<StoryMapperResult | null>(null)
  const [productOpsData, setProductOpsData] = useState<ProductOpsResult | null>(null)

  // Mock projects data
  const [projects] = useState<KickoffProject[]>([
    {
      id: '1',
      title: 'AI Expense Management Platform',
      date: new Date().toLocaleDateString(),
      status: 'completed',
      features_count: 7
    }
  ])

  const handleNewKickoff = () => {
    setCurrentView('generator')
    setError(null)
  }

  const handleGenerate = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    setCurrentStep(0)

    try {
      // Call orchestrator agent
      setCurrentStep(0)
      const result = await callAIAgent(formData.productIdea, ORCHESTRATOR_AGENT_ID)

      if (result.success && result.response.status === 'success') {
        const orchestratorResult = result.response.result as OrchestratorResult
        setOrchestratorData(orchestratorResult)

        // Simulate individual agent responses for demo
        // In production, these would come from the orchestrator's sub-agent calls
        setCurrentStep(1)

        // Mock PRD data based on orchestrator result
        const mockPRDData: PRDResult = {
          problem_statement: orchestratorResult.prd_output.problem_statement,
          user_personas: [
            {
              name: "Sarah, Small Business Owner",
              description: "Owns a local retail store with 10 employees. Manages all business finances herself.",
              pain_points: [
                "Manually tracking receipts and paper invoices",
                "Difficulty reconciling expenses at month-end",
                "Lack of real-time visibility into spending"
              ],
              goals: [
                "Save time on administrative work",
                "Stay on top of cash flow",
                "Easily comply with tax and audit requirements"
              ]
            }
          ],
          features: [
            {
              name: "AI Receipt Capture",
              description: "Users snap photos or upload receipts; AI extracts relevant details and categorizes expenses automatically.",
              user_value: "Eliminates manual data entry and reduces errors in expense tracking."
            }
          ],
          success_metrics: [
            {
              metric: "Reduction in Manual Entry Time",
              target: "At least 70% less time spent on data entry per month",
              measurement_method: "User time-tracking logs and survey responses"
            }
          ],
          scope: {
            in_scope: [
              "AI-based receipt and invoice data extraction",
              "Expense categorization and reporting",
              "Dashboard with analytics and compliance alerts"
            ],
            out_of_scope: [
              "Payroll processing",
              "Tax filing or direct tax payment features",
              "Large enterprise ERP integrations"
            ]
          },
          summary: "This PRD outlines an AI-powered expense management platform tailored for small businesses."
        }
        setPrdData(mockPRDData)

        setCurrentStep(2)

        // Mock Prioritizer data
        const mockPrioritizerData: PrioritizerResult = {
          competitor_analysis: [
            {
              competitor_name: "Expensify",
              strengths: ["User-friendly interface", "Strong integration options"],
              weaknesses: ["Higher pricing", "Limited customization options"],
              market_position: "Expensify is well-regarded in the expense management space for its ease of use and broad functionality."
            }
          ],
          market_insights: {
            market_size: "The global expense management software market is projected to reach $7.9 billion by 2026.",
            trends: ["Increased adoption of AI in financial processes", "Growing demand for real-time reporting"],
            opportunities: ["Integration with emerging fintech solutions", "Expanding into underserved markets in SMBs"]
          },
          prioritized_features: orchestratorResult.prioritization_output.top_features.map((feature, index) => ({
            feature_name: feature,
            rice_score: 120 - (index * 20),
            reach: 1500 - (index * 200),
            impact: 3 - index,
            confidence: 0.9 - (index * 0.05),
            effort: 2 + index,
            priority: index === 0 ? 'High' : index === 1 ? 'High' : 'Medium',
            rationale: `High user impact due to automation and increased accuracy.`
          })),
          roadmap_recommendation: {
            phase_1: orchestratorResult.prioritization_output.top_features.slice(0, 2),
            phase_2: [orchestratorResult.prioritization_output.top_features[2]],
            phase_3: ["Mobile app", "Multi-currency support"]
          },
          summary: "The prioritization strategy focuses on automating key functionalities that enhance user experience and accuracy in expense management."
        }
        setPrioritizerData(mockPrioritizerData)

        setCurrentStep(3)

        // Mock Story Mapper data
        const mockStoryMapperData: StoryMapperResult = {
          epics: [
            {
              epic_name: "Receipt OCR Scanning",
              epic_description: "Enable users to scan and extract information from receipts using OCR technology.",
              business_value: "Automates data entry, improves efficiency, and reduces manual input errors."
            }
          ],
          user_stories: [
            {
              story_id: "US-001",
              epic: "Receipt OCR Scanning",
              title: "Scan a receipt and extract data",
              user_story: "As a user, I want to scan a receipt using my device's camera so that the relevant expense data is automatically extracted and recorded.",
              acceptance_criteria: [
                "Given I have a physical receipt, When I use the scan feature in the app, Then the app uses OCR to extract the merchant, date, and total amount fields.",
                "Given the extracted data is unclear or missing, When the scan is complete, Then prompt the user to manually review and confirm or edit the extracted information."
              ],
              story_points: 13,
              priority: "High",
              sprint_recommendation: "Sprint 1"
            }
          ],
          sprint_plan: {
            sprint_1: {
              stories: ["US-001"],
              total_points: orchestratorResult.story_mapping_output.total_stories > 0 ? 21 : 0,
              focus: "Automated receipt scanning and expense categorization foundations"
            },
            sprint_2: {
              stories: [],
              total_points: 11,
              focus: "Manual refinement of categorization and expense reporting dashboard"
            }
          },
          summary: "This user story mapping converts the top RICE-prioritized features into JIRA-ready user stories with clear acceptance criteria and points."
        }
        setStoryMapperData(mockStoryMapperData)

        // Mock Product Ops data
        const mockProductOpsData: ProductOpsResult = {
          package_created: true,
          workspace_links: {
            prd_url: orchestratorData.delivery_output.notion_url.includes('ERROR')
              ? "https://notion.so/example-prd-url"
              : orchestratorData.delivery_output.notion_url,
            roadmap_url: "https://notion.so/example-roadmap-url",
            user_stories_url: "https://notion.so/example-userstories-url"
          },
          notifications_sent: {
            stakeholders_notified: formData.stakeholderEmails,
            email_subject: "Product Kickoff Package Ready",
            sent_at: new Date().toISOString()
          },
          summary: "Product kickoff deliverables have been packaged and saved in Notion."
        }
        setProductOpsData(mockProductOpsData)

        setCurrentStep(4)
        setCurrentView('results')
      } else {
        setError(result.error || 'Failed to generate kickoff package')
      }
    } catch (err) {
      setError('An error occurred while generating the kickoff package')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartNew = () => {
    setCurrentView('dashboard')
    setOrchestratorData(null)
    setPrdData(null)
    setPrioritizerData(null)
    setStoryMapperData(null)
    setProductOpsData(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentView !== 'dashboard' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('dashboard')}
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">Product Kickoff Crew</h1>
                <p className="text-sm text-slate-400">AI-powered product launch automation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-600 text-indigo-400">
                Enterprise
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Card className="border-red-600 bg-red-600/10 mb-6">
            <CardContent className="py-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white mb-1">Error</div>
                <div className="text-sm text-slate-300">{error}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === 'dashboard' && (
          <DashboardView onNewKickoff={handleNewKickoff} projects={projects} />
        )}

        {currentView === 'generator' && (
          <GeneratorView
            onGenerate={handleGenerate}
            loading={loading}
            currentStep={currentStep}
          />
        )}

        {currentView === 'results' && (
          <ResultsView
            orchestratorData={orchestratorData}
            prdData={prdData}
            prioritizerData={prioritizerData}
            storyMapperData={storyMapperData}
            productOpsData={productOpsData}
            onStartNew={handleStartNew}
          />
        )}
      </main>

      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-400">
            Powered by Lyzr AI Agent Framework
          </div>
        </div>
      </footer>
    </div>
  )
}
