class CreatePhysicians < ActiveRecord::Migration[8.1]
def change
create_table :physicians do |t|
t.string :name, null: false
t.string :specialty, null: false

  t.timestamps
end
end
end
