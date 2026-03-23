import { Board } from './components/Board';
import { Column } from './components/Column';
import { Layout } from './components/Layout';
import { TaskCard } from './components/TaskCard';

function App() {
  return (
    <Layout>
      <Board>
        <Column title="To Do" count={3} showAdd>
          <TaskCard
            taskId="AF-101"
            title="Design System Architecture"
            description="Define the tonal layering logic and shadow specifications for the new brand guidelines."
            variant="todo"
          />
          <TaskCard
            taskId="AF-104"
            title="Glassmorphism Palette"
            description="Research optimal blur levels and opacity for command palettes across different backgrounds."
            variant="todo"
          />
          <TaskCard
            taskId="AF-112"
            title="API Integration: Webhooks"
            description="Set up automated board updates via Slack and Discord integration triggers."
            variant="todo"
          />
        </Column>

        <Column title="In Progress" count={1}>
          <TaskCard
            taskId="AF-108"
            title="Bento Grid Layout Refinement"
            description="Implementing asymmetrical layout logic for the dashboard main canvas widgets."
            variant="in-progress"
          />
        </Column>

        <Column title="Done" count={2}>
          <TaskCard
            taskId="AF-100"
            title="Dracula Pro Palette Audit"
            description="Complete review of legacy colors and mapping to new Material 3 roles."
            variant="done"
          />
          <TaskCard
            taskId="AF-098"
            title="Onboarding Flow UX"
            description="Revised user journey for first-time premium subscribers setup."
            variant="done"
          />
        </Column>
      </Board>
    </Layout>
  );
}

export default App;
