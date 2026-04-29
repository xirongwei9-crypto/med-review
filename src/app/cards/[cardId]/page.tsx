import { getCardById, getAllCards } from "@/lib/cards";
import { notFound } from "next/navigation";
import { CardDetailPage } from "./CardDetailPage";

export function generateStaticParams() {
  return getAllCards().map((card) => ({ cardId: card.id }));
}

export default function CardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  async function render() {
    const { cardId } = await params;
    const card = getCardById(cardId);
    if (!card) notFound();
    return <CardDetailPage card={card} allCards={getAllCards()} />;
  }
  return render();
}
