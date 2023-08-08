class InputChannel < ApplicationCable::Channel
  def subscribed
    stream_from "input_channel"
  end

  def send_input(data)
    session = Session.find(data['session_id'])
    return unless session
    
    activity_operations(data['mouse_clicks'].to_i, data['keystrokes'].to_i, session)
  end

  private

  def activity_operations(clicks, keystrokes, session)
    activity = session.activities.available.first
    
    if activity.nil?
      session.activities.create(start_duration: Time.current, mouse_click: clicks, key_stroke: keystrokes)
    else
      activity.update(mouse_click: activity.mouse_click + clicks)
      activity.update(key_stroke: activity.key_stroke + keystrokes)
    end
  end
end
