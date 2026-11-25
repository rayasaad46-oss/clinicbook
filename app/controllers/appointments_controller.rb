class AppointmentsController < ApplicationController
before_action :set_physician

def index
@appointments = @physician.appointments.includes(:patient).order(:starts_at)
end

def create
@appointment = @physician.appointments.build(appointment_params)

respond_to do |format|
  if @appointment.save
    format.html { redirect_to physician_appointments_path(@physician), notice: "Appointment created." }
    format.json { render json: @appointment, status: :created }
  else
    @appointments = @physician.appointments.includes(:patient).order(:starts_at)
    format.html { render :index, status: :unprocessable_entity }
    format.json { render json: @appointment.errors, status: :unprocessable_entity }
  end
end
end

def destroy
@appointment = @physician.appointments.find(params[:id])
@appointment.destroy

respond_to do |format|
  format.html { redirect_to physician_appointments_path(@physician), notice: "Appointment deleted." }
  format.json { head :no_content }
end
end

private

def set_physician
@physician = Physician.find(params[:physician_id])
end

def appointment_params
params.require(:appointment).permit(:patient_id, :starts_at, :status)
end
end
