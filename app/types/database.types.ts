export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      Task: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          due_date: string | null
          due_time: string | null
          id: number
          status: string | null
          subject: string
          task_name: string | null
          user_id: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: number
          status?: string | null
          subject: string
          task_name?: string | null
          user_id: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: number
          status?: string | null
          subject?: string
          task_name?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Task_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          auth_uid: string
          avatar_url: string | null
          bio: string | null
          birthdate: string | null
          cover_photo_url: string | null
          created_at: string
          email_preference: boolean | null
          full_name: string | null
          grade: string | null
          id: number
          profile_pic_url: string | null
          push_preference: boolean | null
          student_id: string | null
        }
        Insert: {
          auth_uid?: string
          avatar_url?: string | null
          bio?: string | null
          birthdate?: string | null
          cover_photo_url?: string | null
          created_at?: string
          email_preference?: boolean | null
          full_name?: string | null
          grade?: string | null
          id?: number
          profile_pic_url?: string | null
          push_preference?: boolean | null
          student_id?: string | null
        }
        Update: {
          auth_uid?: string
          avatar_url?: string | null
          bio?: string | null
          birthdate?: string | null
          cover_photo_url?: string | null
          created_at?: string
          email_preference?: boolean | null
          full_name?: string | null
          grade?: string | null
          id?: number
          profile_pic_url?: string | null
          push_preference?: boolean | null
          student_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_task: {
        Args: {
          p_category: string
          p_description?: string
          p_due_date: string
          p_due_time?: string
          p_subject?: string
          p_task_name: string
        }
        Returns: Json
      }
      get_calendar_tasks: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: Json
      }
      get_dashboard_data:
        | { Args: never; Returns: Json }
        | { Args: { p_timezone_offset?: number }; Returns: Json }
      get_profile_data: { Args: { p_timezone_offset?: number }; Returns: Json }
      get_report_data: { Args: { days: number }; Returns: Json }
      toggle_task_status: {
        Args: { p_completed: boolean; p_task_id: number }
        Returns: Json
      }
      update_profile:
        | {
            Args: {
              p_avatar_url?: string
              p_bio?: string
              p_birthdate?: string
              p_cover_photo_url?: string
              p_full_name?: string
              p_student_id?: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_avatar_url?: string
              p_bio?: string
              p_birthdate?: string
              p_cover_photo_url?: string
              p_full_name?: string
              p_grade?: string
              p_student_id?: string
            }
            Returns: Json
          }
      update_task: {
        Args: {
          p_category: string
          p_description?: string
          p_due_date: string
          p_due_time: string
          p_status?: string
          p_subject: string
          p_task_id: number
          p_task_name: string
        }
        Returns: Json
      }
      update_user_preferences: {
        Args: { p_email: boolean; p_push: boolean }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
