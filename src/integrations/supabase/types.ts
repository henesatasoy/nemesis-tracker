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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      match_participants: {
        Row: {
          character_class: Database["public"]["Enums"]["character_class"]
          contingency_passed: boolean | null
          created_at: string
          death_cause: Database["public"]["Enums"]["death_cause"] | null
          death_round: number | null
          escape_method: Database["public"]["Enums"]["escape_method"] | null
          id: string
          is_winner: boolean
          match_id: string
          objective_met: boolean | null
          player_id: string
          status: Database["public"]["Enums"]["participant_status"]
        }
        Insert: {
          character_class: Database["public"]["Enums"]["character_class"]
          contingency_passed?: boolean | null
          created_at?: string
          death_cause?: Database["public"]["Enums"]["death_cause"] | null
          death_round?: number | null
          escape_method?: Database["public"]["Enums"]["escape_method"] | null
          id?: string
          is_winner?: boolean
          match_id: string
          objective_met?: boolean | null
          player_id: string
          status?: Database["public"]["Enums"]["participant_status"]
        }
        Update: {
          character_class?: Database["public"]["Enums"]["character_class"]
          contingency_passed?: boolean | null
          created_at?: string
          death_cause?: Database["public"]["Enums"]["death_cause"] | null
          death_round?: number | null
          escape_method?: Database["public"]["Enums"]["escape_method"] | null
          id?: string
          is_winner?: boolean
          match_id?: string
          objective_met?: boolean | null
          player_id?: string
          status?: Database["public"]["Enums"]["participant_status"]
        }
        Relationships: [
          {
            foreignKeyName: "match_participants_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          date_played: string
          game_mode: Database["public"]["Enums"]["game_mode"]
          id: string
          map_type: Database["public"]["Enums"]["map_type"]
          notes: string | null
          player_count: number
        }
        Insert: {
          created_at?: string
          date_played?: string
          game_mode?: Database["public"]["Enums"]["game_mode"]
          id?: string
          map_type?: Database["public"]["Enums"]["map_type"]
          notes?: string | null
          player_count?: number
        }
        Update: {
          created_at?: string
          date_played?: string
          game_mode?: Database["public"]["Enums"]["game_mode"]
          id?: string
          map_type?: Database["public"]["Enums"]["map_type"]
          notes?: string | null
          player_count?: number
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      character_class:
        | "Sentinel"
        | "Hacker"
        | "Janitor"
        | "Lab Rat"
        | "Survivor"
        | "Xenobiologist"
      death_cause:
        | "Intruder Attack"
        | "Larva/Contamination"
        | "Bleeding/Wounds"
        | "Fire"
        | "Facility Self-Destruct"
        | "Time Limit"
        | "Friendly Fire"
        | "Contingency Procedure"
        | "Event Card"
      escape_method:
        | "Isolation Room"
        | "CSS Pod"
        | "Surface Bunker"
        | "Main Gate"
      game_mode: "Normal (Semi-Coop)" | "Cooperative"
      map_type: "Underground Facility" | "Mars Surface"
      participant_status: "Survived" | "Dead"
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
    Enums: {
      character_class: [
        "Sentinel",
        "Hacker",
        "Janitor",
        "Lab Rat",
        "Survivor",
        "Xenobiologist",
      ],
      death_cause: [
        "Intruder Attack",
        "Larva/Contamination",
        "Bleeding/Wounds",
        "Fire",
        "Facility Self-Destruct",
        "Time Limit",
        "Friendly Fire",
        "Contingency Procedure",
        "Event Card",
      ],
      escape_method: [
        "Isolation Room",
        "CSS Pod",
        "Surface Bunker",
        "Main Gate",
      ],
      game_mode: ["Normal (Semi-Coop)", "Cooperative"],
      map_type: ["Underground Facility", "Mars Surface"],
      participant_status: ["Survived", "Dead"],
    },
  },
} as const
