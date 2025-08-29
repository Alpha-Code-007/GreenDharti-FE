import React, { useEffect, useState } from "react";
import API, { PublicApi } from "../services/api";
import "./EventsSection.css";
import { FaShareAlt } from "react-icons/fa";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const getImageUrl = (relativePath) => {
    return `${API_BASE}/api/images/${relativePath}`;
  };

  const handleShare = async (event) => {
    const eventSlug = slugify(event.title);
    const shareData = {
      title: event.title,
      text: event.description,
      url: `${window.location.origin}/events/${eventSlug}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error sharing:", error);
          Swal.fire("Error", "Could not share this event.", "error");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Link copied to clipboard!',
          showConfirmButton: false,
          timer: 2000
        });
      } catch (err) {
        console.error("Failed to copy link: ", err);
        Swal.fire("Error", "Could not copy link.", "error");
      }
    }
  };
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await PublicApi.getEvents();
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error("Error fetching events", err);

      }
    };

    fetchEvents();
  }, []);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };



  return (
    <section className="events-section" id="events">
      <h2 className="section-title">Upcoming Events</h2>
      <div className="events-container">
        {events.filter(event => event.status === "UPCOMING").sort((a, b) => new Date(a.date || a.eventDate) - new Date(b.date || b.eventDate)).slice(0, 3)
          .map((event, index) => {
            const dateObj = new Date(event.date || event.eventDate);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString("default", { month: "short" });
            const year = dateObj.getFullYear();
            const dayOfWeek = dateObj.toLocaleString("default", { weekday: "long" });
            const time = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                className="event-card"
                key={event._id || event.id || index}

              >
                <div className="event-date-col">
                  <span className="month-day">{month} {day}</span>
                  <span className="year">{year}</span>
                </div>

                <div className="event-details-col">
                  <p className="event-datetime">{dayOfWeek} {time}</p>
                  <h3 className="event-title" >{event.title}</h3>
                  <p className="description" onClick={() => handleCardClick(event)} // 🔥 Open modal on click
                    style={{ cursor: "pointer" }}>{
                      event.description?.length > 200
                        ? event.description.slice(0, 200) + "..."
                        : event.description
                    }</p>
                  {event.imageUrl && (
                    <img
                      src={getImageUrl(event.imageUrl)}
                      alt={event.title}
                      className="event-image"
                      onError={(e) => {
                        e.currentTarget.src = "/crowdfund_logo.png"; // fallback if 404 or broken
                        e.currentTarget.onerror = null; // prevent infinite loop if default also missing
                      }}
                    />
                  )}

                  <button
                    className="share-button"
                    onClick={() => handleShare(event)}
                  >
                    Share <FaShareAlt />
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {modalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-header">
              <img
                src={getImageUrl(selectedEvent.imageUrl)}
                alt={selectedEvent.title}
                className="modal-image"
                onError={(e) => {
                  e.currentTarget.src = "/crowdfund_logo.png"; // fallback if 404 or broken
                  e.currentTarget.onerror = null; // prevent infinite loop if default also missing
                }}
              />
            </div>
            <div className="modal-body">
              <h2>{selectedEvent.title}</h2>
              <p className={`status ${selectedEvent.status?.toLowerCase()}`}>
                {selectedEvent.status}
              </p>

              <p className="modal-description">{selectedEvent.description}</p>
              <div className="modal-details">
                <p><strong>Date:</strong> {new Date(selectedEvent.date || selectedEvent.eventDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(selectedEvent.date || selectedEvent.eventDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                })}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventsSection;
