using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models;

class Usuario
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public String? id {get; set;}
    public String usr_name {get; set;} = null!;
    public String? usr_icon {get; set;} = null!;
    public DateTime data_nasc {get; set;}
    [BsonElement("senha_hash")]
    public String senha {get; set;} = null!;
    public String? bio {get; set;}
    [BsonRepresentation(BsonType.ObjectId)]
    public List<String> jogos_fav {get; set;} = new();
    [BsonRepresentation(BsonType.ObjectId)]
    public List<String> jogos_curt {get; set;} = new();
    [BsonRepresentation(BsonType.ObjectId)]
    public List<String> usr_seguindo {get; set;} = new();
    [BsonRepresentation(BsonType.ObjectId)]
    public List<String> jogados {get; set;} = new();
    [BsonRepresentation(BsonType.ObjectId)]
    public List<String> usr_seguidores {get; set;} = new();
}

class Reviews
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public String id {get; set;} = null!;
    [BsonRepresentation(BsonType.ObjectId)]
    public String usr_id {get; set;} = null!;
    [BsonRepresentation(BsonType.ObjectId)]
    public String jogo_id {get; set;} = null!;
    public String? comentario {get; set;} 
    public String avaliacao {get; set;} = null!;
    public DateTime data {get; set;}
    public int nCurtidas {get; set;}
    [BsonRepresentation(BsonType.ObjectId)]
    public List<String> usrs_curtidas {get; set;} = new();
}

class Jogos
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public String id {get; set;} = null!;
    public int avaliacao {get; set;}
    public int nAvaliacao {get; set;}
    public int likes {get; set;}
    public int jogaram {get; set;}
}