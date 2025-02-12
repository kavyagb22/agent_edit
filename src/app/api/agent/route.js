import { connectDB } from "../../../lib/mongodb";

export async function GET(req) {
  try {
    const db = await connectDB();
    const collection = db.collection("agent");

    console.log("Fetching agents");
    const agents = await collection.find({}).toArray();
    if (agents.length === 0) {
      return new Response(JSON.stringify({ error: "Agents not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ agents }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const db = await connectDB();
    const collection = db.collection("agent");
    const { id } = await req.json();

    const agent = await collection.findOne({ id });
    if (!agent) {
      return new Response(JSON.stringify({ error: "Agent not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ agent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(req) {
  try {
    const db = await connectDB();
    const collection = db.collection("agent");
    const {
      xPrompt,
      tgPrompt,
      oldId,
      newId,
      behavior,
      name,
      persona,
      style,
      xFollow,
      xTools,
      tgTools,
      chatMessage,
    } = await req.json();

    const agent = await collection.findOne({ id: oldId });
    if (!agent) {
      return new Response(JSON.stringify({ error: "Agent not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    let updatedFields = {};

    if (newId) updatedFields.id = newId;
    if (behavior) updatedFields["dna.behavior"] = behavior;
    if (name) updatedFields["dna.name"] = name;
    if (persona) updatedFields["dna.persona"] = persona;
    if (style) updatedFields["dna.style"] = style;

    agent.apps.forEach((app) => {
      if (app.type === "X" && xPrompt !== undefined) {
        app.prompt = xPrompt;
        app.follow = xFollow;
        app.tools = xTools;
      } else if (app.type === "TG" && tgPrompt !== undefined) {
        app.prompt = tgPrompt;
        app.chat_message = chatMessage;
        app.tools = tgTools;
      }
    });

    updatedFields.apps = agent.apps;

    await collection.updateOne({ id: oldId }, { $set: updatedFields });

    return new Response(
      JSON.stringify({ message: "Agent updated successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
