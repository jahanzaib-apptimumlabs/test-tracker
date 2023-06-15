class SessionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "session_channel"
  end

  def create(data)
    checkin_time = convert_time_format(data['checkin_time'])
    session = Session.create!(checkin_time: checkin_time, working_time: checkin_time)
    broadcast_session(session)
  end

  def update(data)
    session = Session.find(data['session_id'])
    return unless session

    case data['time_type']
    when 'work'
      update_work_timings(data, session)
    when 'break'
      update_break_timings(data, session)
    when 'meeting'
      update_meeting_timings(data, session)
    end
  end

  def stop(data)
    session = Session.find(data['session_id'])
    return unless session

    total_session_duration = calculate_total_time(session)
    session.update(checkout_time: Time.current, total_time: total_session_duration)
    broadcast_stop_session(session)
    reject
  end

  private

  def broadcast_session(session)
    session_data = {
      id: session.id,
      working_time: session.working_time
    }
    broadcast_data(session_data)
  end

  def broadcast_stop_session(session)
    session_data = {
      id: session.id,
      working_time: session.working_time,
      checkout_time: session.checkout_time
    }
    broadcast_data(session_data)
  end

  def broadcast_update_session(session)
    session_data = {
      id: session.id,
      working_time: session.break_time
    }
    broadcast_data(session_data)
  end

  def broadcast_data(data)
    puts data
    ActionCable.server.broadcast 'session_channel', [data]
  end

  def calculate_duration(previous_duration, previous_time, time)
    interval = time.to_time - previous_time
    previous_duration.to_f + interval
  end

  def convert_time_format(time_value)
    Time.parse(time_value).in_time_zone
  end

  def update_work_timings(data, session)
    working_time = convert_time_format(data['current_time']) if data['current_time'].present?
    previous_working_duration = session.working_duration || 0.0
    new_working_duration = calculate_duration(previous_working_duration, session.working_time, working_time)
    session.update(working_time: working_time, working_duration: new_working_duration)
  end

  def update_break_timings(data, session)
    session.update(break_time: Time.current) if session.break_time.nil?
    break_time = convert_time_format(data['current_time']) if data['current_time'].present?
    previous_break_duration = session.break_duration || 0.0
    new_break_duration = calculate_duration(previous_break_duration, session.break_time, break_time)
    session.update(break_time: break_time, break_duration: new_break_duration)
  end

  def update_meeting_timings(data, session)
    session.update(meeting_time: Time.current) if session.meeting_time.nil?
    meeting_time = convert_time_format(data['current_time']) if data['current_time'].present?
    previous_meeting_duration = session.meeting_duration || 0.0
    new_meeting_duration = calculate_duration(previous_meeting_duration, session.meeting_time, meeting_time)
    session.update(meeting_time: meeting_time, meeting_duration: new_meeting_duration)
  end

  def calculate_total_time(session)
    session.working_duration + session.break_duration + session.meeting_duration
  end
end
