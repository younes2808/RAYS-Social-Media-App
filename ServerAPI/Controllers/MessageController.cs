using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.DAL;
using ServerAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly ServerAPIContext _context;

        public MessageController(ServerAPIContext context)
        {
            _context = context;
        }

        // POST: api/message/send
        [HttpPost("send")]
        public async Task<ActionResult<Message>> SendMessage([FromBody] MessageRequest messageRequest)
        {
            // Check if the message request is null
            if (messageRequest == null)
            {
                return BadRequest("Message cannot be null");
            }

            // Validate that SenderId and ReceiverId are not the same
            if (messageRequest.SenderId == messageRequest.ReceiverId)
            {
                return BadRequest("Sender and receiver cannot be the same user.");
            }

            // Create a new Message instance from the MessageRequest
            var message = new Message
            {
                SenderId = messageRequest.SenderId,
                ReceiverId = messageRequest.ReceiverId,
                Content = messageRequest.Content,
                Timestamp = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Europe/Oslo")), // Set the timestamp to the current time
            };

            // Add the new message
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Return the created message with the autogenerated Id
            return CreatedAtAction(nameof(GetMessages), new { senderId = message.SenderId, receiverId = message.ReceiverId }, message);
        }

        // GET: api/message/conversations/{userId}
        [HttpGet("conversations/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetConversations(int userId)
        {
            // Get all sent messages
            var sentMessages = await _context.Messages
                .Where(m => m.SenderId == userId)
                .Select(m => new
                {
                    UserId = m.ReceiverId, // Change to UserId for clarity
                    m.Content,
                    m.Timestamp,
                    IsResponded = true // Sent messages are considered responded
                })
                .ToListAsync();

            // Get all received messages
            var receivedMessages = await _context.Messages
                .Where(m => m.ReceiverId == userId)
                .Select(m => new
                {
                    UserId = m.SenderId, // Change to UserId for clarity
                    m.Content,
                    m.Timestamp,
                    IsResponded = false // Received messages are considered not responded
                })
                .ToListAsync();

            // Combine both lists and select the latest message for each user
            var allMessages = sentMessages
                .Concat(receivedMessages)
                .GroupBy(m => m.UserId) // Grouping by UserId to avoid duplicates
                .Select(g => g.OrderByDescending(m => m.Timestamp).FirstOrDefault()) // Select the latest message from each user
                .ToList();

            return Ok(allMessages);
        }


        // GET: api/message/{senderId}/{receiverId}
        [HttpGet("{senderId}/{receiverId}")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages(int senderId, int receiverId)
        {
            var conversation = await _context.Messages
                .Where(m =>
                    (m.SenderId == senderId && m.ReceiverId == receiverId) ||
                    (m.SenderId == receiverId && m.ReceiverId == senderId))
                .OrderBy(m => m.Timestamp)
                .ToListAsync();

            return Ok(conversation);
        }
    }
}
