import { motion } from "framer-motion";
import { models } from "@/ai/models";
import { AIModelIcon } from "@/components/shared/ai-model-icon";

export const Overview = ({ modelId }: { modelId: string }) => {
    const model = models.find((model) => model.id === modelId) || models[0];

    return (
        <>
            <motion.div
                key="overview"
                className="max-w-3xl mx-auto md:mt-20"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: 0.5 }}
            >
                <div className="rounded-xl p-6 flex flex-col gap-4 leading-relaxed text-center max-w-xl">
                    <div className="flex flex-row justify-center gap-4 items-center">
                        <div className="size-12">
                            <AIModelIcon model={model} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-center text-2xl font-semibold">
                            {model?.label}
                        </h1>
                    </div>
                </div>
            </motion.div>
        </>
    );
};
