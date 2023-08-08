class ImageChannel < ApplicationCable::Channel
  def subscribed
      stream_from "image_channel"
  end

  def send_image(data)
    session = Session.find(data['session_id'])
    return unless session

    save_screenshot(session, data['image_url']) if data['image_url']&.present?
  end

  private

  def save_screenshot(session, image_url)
    image_record = session.image_records.new(image_url: image_url)

    if !image_record.save
      raise StandardError, "Failed to save screenshot"
    end
  end
end
