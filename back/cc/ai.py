from cc.models import Customer
from cc.models import Message
from cc.models import Template

def ai(customer):
    messages = Message.objects.filter(customer=customer)
    message_count = len(messages)
    if message_count>0:
        last_message = messages[message_count-1]
        max_match = 0
        match_reply = ""
        for template in Template.objects.all():
            question_words = [i.upper() for i in template.question.split()]
            match = 0
            for word in last_message.message.upper().split():
                for q in question_words:
                    if q in word:
                        match += 1
            if match > max_match:
                max_match = match
                match_reply = template.reply
        return (match_reply)
    return ""
