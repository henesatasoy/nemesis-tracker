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
      contingencies_catalog: {
        Row: {
          created_at: string
          effect_text: string
          id: string
          lethality: Database["public"]["Enums"]["lethality_type"]
          name: string
        }
        Insert: {
          created_at?: string
          effect_text: string
          id?: string
          lethality: Database["public"]["Enums"]["lethality_type"]
          name: string
        }
        Update: {
          created_at?: string
          effect_text?: string
          id?: string
          lethality?: Database["public"]["Enums"]["lethality_type"]
          name?: string
        }
        Relationships: []
      }
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
      objectives_catalog: {
        Row: {
          created_at: string
          description: string
          id: string
          max_players: number
          min_players: number
          title: string
          type: Database["public"]["Enums"]["objective_type"]
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          max_players?: number
          min_players?: number
          title: string
          type: Database["public"]["Enums"]["objective_type"]
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          max_players?: number
          min_players?: number
          title?: string
          type?: Database["public"]["Enums"]["objective_type"]
        }
        Relationships: []
      }
      player_contingency_knowledge: {
        Row: {
          contingency_id: string
          created_at: string
          id: string
          match_id: string
          player_id: string
          status: Database["public"]["Enums"]["contingency_status"]
          updated_at: string
        }
        Insert: {
          contingency_id: string
          created_at?: string
          id?: string
          match_id: string
          player_id: string
          status?: Database["public"]["Enums"]["contingency_status"]
          updated_at?: string
        }
        Update: {
          contingency_id?: string
          created_at?: string
          id?: string
          match_id?: string
          player_id?: string
          status?: Database["public"]["Enums"]["contingency_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_contingency_knowledge_contingency_id_fkey"
            columns: ["contingency_id"]
            isOneToOne: false
            referencedRelation: "contingencies_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_contingency_knowledge_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_contingency_knowledge_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_objectives: {
        Row: {
          created_at: string
          id: string
          match_id: string
          notes: string | null
          objective_id: string
          player_id: string
          status: Database["public"]["Enums"]["objective_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          notes?: string | null
          objective_id: string
          player_id: string
          status?: Database["public"]["Enums"]["objective_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          notes?: string | null
          objective_id?: string
          player_id?: string
          status?: Database["public"]["Enums"]["objective_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_objectives_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_objectives_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_objectives_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
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
      session_contingencies: {
        Row: {
          active_contingency_id: string | null
          created_at: string
          id: string
          is_revealed: boolean
          match_id: string
          updated_at: string
        }
        Insert: {
          active_contingency_id?: string | null
          created_at?: string
          id?: string
          is_revealed?: boolean
          match_id: string
          updated_at?: string
        }
        Update: {
          active_contingency_id?: string | null
          created_at?: string
          id?: string
          is_revealed?: boolean
          match_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_contingencies_active_contingency_id_fkey"
            columns: ["active_contingency_id"]
            isOneToOne: false
            referencedRelation: "contingencies_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_contingencies_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
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
      contingency_status: "POSSIBLE" | "ELIMINATED" | "SUSPECTED" | "CONFIRMED"
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
      lethality_type:
        | "KNOWLEDGE_CHECK"
        | "LOCATION_CHECK"
        | "CSS_CHECK"
        | "GLOBAL_KILL"
      map_type: "Underground Facility" | "Mars Surface"
      objective_status:
        | "DRAFT"
        | "ACTIVE"
        | "DISCARDED"
        | "COMPLETED"
        | "FAILED"
      objective_type: "CORPORATE" | "PERSONAL" | "SOLO_COOP"
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
      contingency_status: ["POSSIBLE", "ELIMINATED", "SUSPECTED", "CONFIRMED"],
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
      lethality_type: [
        "KNOWLEDGE_CHECK",
        "LOCATION_CHECK",
        "CSS_CHECK",
        "GLOBAL_KILL",
      ],
      map_type: ["Underground Facility", "Mars Surface"],
      objective_status: ["DRAFT", "ACTIVE", "DISCARDED", "COMPLETED", "FAILED"],
      objective_type: ["CORPORATE", "PERSONAL", "SOLO_COOP"],
      participant_status: ["Survived", "Dead"],
    },
  },
} as const
