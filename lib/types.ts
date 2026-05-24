export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          category: string | null;
          event_date: string;
          venue: string;
          district: string;
          maps_url: string | null;
          registration_url: string | null;
          status: "pending" | "approved";
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category?: string | null;
          event_date: string;
          venue: string;
          district: string;
          maps_url?: string | null;
          registration_url?: string | null;
          status?: "pending" | "approved";
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string | null;
          event_date?: string;
          venue?: string;
          district?: string;
          maps_url?: string | null;
          registration_url?: string | null;
          status?: "pending" | "approved";
          created_at?: string;
        };
      };
    };
  };
};
