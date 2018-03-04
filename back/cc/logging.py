from cc.models import Log


def save(username, action, result, positive):
    try:
        log = Log()
        log.username = username
        log.action = str(action)
        log.result = str(result)
        log.positive = positive
        log.save()
    except:
        pass
