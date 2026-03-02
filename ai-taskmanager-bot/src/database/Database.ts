import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { config } from '../config';

export interface Task {
  id: number;
  guildId: string;
  userId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

class DatabaseManager {
  private db: Database | null = null;

  async init(): Promise<void> {
    this.db = await open({
      filename: config.databasePath,
      driver: sqlite3.Database
    });

    await this.createTables();
    console.log('✅ Database initialized');
  }

  private async createTables(): Promise<void> {
    await this.db?.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'todo',
        priority TEXT DEFAULT 'medium',
        due_date INTEGER,
        assigned_to TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE TABLE IF NOT EXISTS task_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER,
        user_id TEXT,
        comment TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_guild ON tasks(guild_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    `);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const result = await this.db?.run(`
      INSERT INTO tasks (guild_id, user_id, title, description, status, priority, due_date, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      task.guildId,
      task.userId,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate ? Math.floor(task.dueDate.getTime() / 1000) : null,
      task.assignedTo
    ]);
    return result?.lastID || 0;
  }

  async getTasksByGuild(guildId: string, status?: string): Promise<Task[]> {
    let query = 'SELECT * FROM tasks WHERE guild_id = ?';
    const params: any[] = [guildId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    const rows = await this.db?.all(query, params);
    return (rows || []).map(this.rowToTask);
  }

  async getTasksByUser(userId: string, guildId: string): Promise<Task[]> {
    const rows = await this.db?.all(`
      SELECT * FROM tasks 
      WHERE user_id = ? AND guild_id = ?
      ORDER BY priority DESC, created_at DESC
    `, [userId, guildId]);
    return (rows || []).map(this.rowToTask);
  }

  async getTaskCount(guildId: string, userId: string): Promise<number> {
    const result = await this.db?.get(`
      SELECT COUNT(*) as count FROM tasks WHERE guild_id = ? AND user_id = ?
    `, [guildId, userId]);
    return result?.count || 0;
  }

  async updateTaskStatus(taskId: number, status: Task['status']): Promise<void> {
    await this.db?.run(`
      UPDATE tasks SET status = ?, updated_at = strftime('%s', 'now') WHERE id = ?
    `, [status, taskId]);
  }

  async assignTask(taskId: number, userId: string): Promise<void> {
    await this.db?.run(`
      UPDATE tasks SET assigned_to = ?, updated_at = strftime('%s', 'now') WHERE id = ?
    `, [userId, taskId]);
  }

  async deleteTask(taskId: number): Promise<void> {
    await this.db?.run('DELETE FROM tasks WHERE id = ?', [taskId]);
  }

  async getOverdueTasks(guildId: string): Promise<Task[]> {
    const now = Math.floor(Date.now() / 1000);
    const rows = await this.db?.all(`
      SELECT * FROM tasks 
      WHERE guild_id = ? AND due_date < ? AND status != 'done'
    `, [guildId, now]);
    return (rows || []).map(this.rowToTask);
  }

  private rowToTask(row: any): Task {
    return {
      id: row.id,
      guildId: row.guild_id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: row.due_date ? new Date(row.due_date * 1000) : null,
      assignedTo: row.assigned_to,
      createdAt: new Date(row.created_at * 1000),
      updatedAt: new Date(row.updated_at * 1000)
    };
  }
}

export const db = new DatabaseManager();