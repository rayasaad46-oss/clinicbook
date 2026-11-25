class CreateAppointments < ActiveRecord::Migration[8.1]
def change
create_table :appointments do |t|
t.references :physician, null: false, foreign_key: true
t.references :patient, null: false, foreign_key: true
t.datetime :starts_at, null: false
t.string :status, null: false, default: "scheduled"

  t.timestamps
end

add_index :appointments, [:physician_id, :starts_at], unique: true
end
end
