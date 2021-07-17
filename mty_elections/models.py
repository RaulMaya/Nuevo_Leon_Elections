from .app import db


class Mty(db.Model):
    __tablename__ = 'mty'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)

    def __repr__(self):
        return '<Mty %r>' % (self.name)
